/**
 * @swagger
 * components:
 *  schemas:
 *      Login:
 *          type: object
 *          properties:
 *              username/email:
 *                  type: string
 *              password:
 *                  type: string
 *      User:
 *          type: object
 *          properties:
 *              username:
 *                  type: string
 *              email:
 *                  type: string
 *              firstname:
 *                  type: string
 *              lastname:
 *                  type: string
 *              password:
 *                  type: string
 *          required:
 *              - username
 *              - email
 *              - password
 *       
 */
/**
 *@swagger
 *components:
 *  securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *  requestBodies:
 *      Login:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username/email:
 *                              type: string
 *                          password:
 *                              type: string
 *                              format: password
 *      updateUserFromAdmin:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          email:
 *                              type: string
 *                          firstname:
 *                              type: string
 *                          lastname:
 *                              type: string
 *                          password:
 *                              type: string
 *                              format: password
 *      updateMyAccount:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          email:
 *                              type: string
 *                          firstname:
 *                              type: string
 *                          lastname:
 *                              type: string
 *      insertUserWithGames:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          email:
 *                              type: string
 *                          firstname:
 *                              type: string
 *                          lastname:
 *                              type: string
 *                          password:
 *                              type: string
 *                              format: password
 *                          games:
 *                              type: object
 *                              properties:
 *                                  games1:
 *                                      type: array
 *                                      items:
 *                                          oneOf:
 *                                              - type: string
 *                                              - type: integer
 *                                  games2:
 *                                      type: array
 *                                      items:
 *                                          oneOf:
 *                                              - type: string
 *                                              - type: integer
 *                                  gamesN:
 *                                      type: array
 *                                      items:
 *                                          oneOf:
 *                                              - type: string
 *                                              - type: integer
 *                      required:
 *                          - username
 *                          - email
 *                          - password
 *                          - games  
 *      createUser:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          email:
 *                              type: string
 *                          firstname:
 *                              type: string
 *                          lastname:
 *                              type: string
 *                          password:
 *                              type: string
 *                              format: password
 *                      required:
 *                          - username
 *                          - email
 *                          - password
 */
const pool = require("../model/database");
const UserModel = require("../model/user.js");
const UserDB = require("../model/userDB.js");
const GamesDB = require("../model/game.js");
const publicationDB = require("../model/publication.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tools = require("../tools/utils.js");
const HTTPStatus = require("../tools/HTTPStatus.js");

/**
 * Login a user that already exists
 *
 * @param {Request} req from the body need to have username or email and password
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.login = async (req, res) => {
    const model = {
        username: ["string", "optional"],
        email: ["string", "optional"],
        password: ["string"],
    };
    if (!tools.isValidObject(req.body, model, true)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Missing parameters");
        return;
    }
    const { username, email, password } = req.body;
    if (!tools.isValidEmail(email)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Wrong email format");
        return;
    }
    const client = await pool.connect();
    try {
        const user = await UserModel.getUser(client, username, email);
        if (!user) {
            res.status(HTTPStatus.NOT_FOUND).send("User does not exist");
            return;
        }
        const {
            id,
            username: usernameClient,
            email: emailClient,
            firstname,
            lastname,
            hashed_password: hashedPassword,
        } = user;

        if (!(await bcrypt.compare(password, hashedPassword))) {
            res.status(HTTPStatus.BAD_REQUEST).send(
                "Wrong password or username/email"
            );
            return;
        }
        const token = jwt.sign(
            {
                data: {
                    id,
                    username: usernameClient,
                    email: emailClient,
                    firstname: firstname,
                    lastname: lastname,
                    hashedPassword: hashedPassword,
                },
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );
        res.status(HTTPStatus.ACCEPTED).json({ token });
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * create a new user
 *
 * @param {Request} req from the body need to have username, email, password, firstname(optionnal), lastname (optionnal)
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.postUser = async (req, res) => {
    const model = {
        username: ["string"],
        email: ["string"],
        firstname: ["string", "optional"],
        lastname: ["string", "optional"],
        password: ["string"],
    };
    if (!tools.isValidObject(req.body, model)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Missing parameters");
        return;
    }
    const { username, email, firstname, lastname, password } = req.body;
    if (!tools.isValidEmail(email)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Wrong email format");
        return;
    }

    const client = await pool.connect();

    try {
        const user = await UserModel.getUser(client, username, email);

        if (user !== null) {
            res.status(HTTPStatus.CONFLICT).send(
                "email or username already exists"
            );
            return;
        }

        await UserDB.postUser(
            client,
            username,
            email,
            await bcrypt.hash(password, 10),
            firstname,
            lastname
        );

        res.status(HTTPStatus.CREATED).send("created");
    } catch (error) {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(
            "Internal server error"
        );
    } finally {
        client.release();
    }
}

/**
 * delete a user from an admin account
 *
 * @param {Request} req need to have an id from the url
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.deleteUserFromAdmin = async (req, res) => {
    const id = parseInt(req.params.userId);
    if (isNaN(id)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Id must be a Number");
        return;
    }
    const client = await pool.connect();
    try {
        if (await UserDB.isAdmin(client, id)) {
            res.status(HTTPStatus.FORBIDDEN).send(
                "Can't delete an admin account"
            );
            return;
        }
        client.query("BEGIN");
        await GamesDB.deleteGamesFromUser(client, id);
        const { rowCount } = await UserDB.deleteUser(client, id);
        if (rowCount === 0) {
            res.status(HTTPStatus.NOT_FOUND).send("User not found");
            return;
        }

        await client.query("COMMIT");

        res.sendStatus(HTTPStatus.NO_CONTENT);
    } catch (error) {
        await client.query("ROLLBACK");
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * the user can delete his account with his token
 *
 * @param {Request} req only need to have the token
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.deleteMyAccount = async (req, res) => {
    const actualUserId = req.session.data.id;
    const client = await pool.connect();
    try {
        if (await UserDB.isAdmin(client, actualUserId)) {
            res.status(HTTPStatus.FORBIDDEN).send(
                "Can't delete an admin account"
            );
            return;
        }
        client.query("BEGIN");

        await GamesDB.deleteGamesFromUser(client, actualUserId);
        await UserDB.deleteUser(client, actualUserId);

        await client.query("COMMIT");
        res.sendStatus(HTTPStatus.NO_CONTENT);
    } catch (error) {
        await client.query("ROLLBACK");
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};

/**
 * update a user from an admin account
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.updateUserFromAdmin = async (req, res) => {
    const id = parseInt(req.params.userId);
    if (isNaN(id)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Id must be a Number");
        return;
    }
    const body = req.body;

    if (!tools.isValidEmail(body.email)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Wrong email format");
        return;
    }

    const client = await pool.connect();
    try {
        const userOBJ = (await UserDB.getUserFromId(client, id)).rows[0];

        if (!userOBJ) {
            res.status(HTTPStatus.NOT_FOUND).send("User not found");
            return;
        }

        if (
            userOBJ.username !== body.username &&
            (await UserDB.clientExists(client, undefined, body.username))
        ) {
            res.status(HTTPStatus.CONFLICT).send("Username already exists");
            return;
        }
        if (
            userOBJ.email !== body.email &&
            (await UserDB.clientExists(
                client,
                undefined,
                undefined,
                body.email
            ))
        ) {
            res.status(HTTPStatus.CONFLICT).send("Email already exists");
            return;
        }

        body.password = body.password
            ? await bcrypt.hash(body.password, 10)
            : undefined;

        await UserDB.updateUser(client, id, body);

        res.sendStatus(HTTPStatus.NO_CONTENT);
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * the user can update his account
 *
 * @param {Request} req from the body need to have username, email, firstname, lastname
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.updateMyAccount = async (req, res) => {
    const model = {
        username: ["string"],
        email: ["string"],
        firstname: ["string", "optional"],
        lastname: ["string", "optional"],
    };
    const actualUser = req.session.data;
    const body = req.body;
    if (!tools.isValidObject(body, model)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Missing parameters");
        return;
    }
    if (!tools.isValidEmail(body.email)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Wrong email format");
        return;
    }
    const client = await pool.connect();

    try {
        if (
            actualUser.username !== body.username &&
            (await UserDB.clientExists(client, undefined, body.username))
        ) {
            res.status(HTTPStatus.CONFLICT).send("Username already exists");
            return;
        }

        if (
            actualUser.email !== body.email &&
            (await UserDB.clientExists(client, undefined, undefined, body.email))
        ) {
            res.status(HTTPStatus.CONFLICT).send("Email already exists");
            return;
        }

        await UserDB.updateUser(client, actualUser.id, body);

        const token = jwt.sign(
            {
                data: {
                    id: actualUser.id,
                    username: body.username,
                    email : body.email,
                    firstname : body.firstname,
                    lastname : body.lastname,
                    hashedPassword: actualUser.hashedPassword,
                },
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );
        res.status(HTTPStatus.NO_CONTENT).json({ token });
    } catch (error) {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * insert a user with his games
 *
 * @param {Request} req from the body need to have username, email, password, firstname, lastname and games composed of platform and nameId
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
// games need to be add like that games : {"games1" : ["PC",100]}
module.exports.postUserWithGames = async (req, res) => {
    const model = {
        username: ["string"],
        email: ["string"],
        firstname: ["string", "optional"],
        lastname: ["string", "optional"],
        password: ["string"],
        games: ["object"],
    };
    const {
        username,
        email,
        firstname,
        lastname,
        password,
        games: videoGames,
    } = req.body;
    if (!tools.isValidObject(req.body, model)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Missing parameters");
        return;
    }
    if (!tools.isValidEmail(email)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Wrong email format");
    } else {
        const client = await pool.connect();
        try {
            client.query("BEGIN");
            if (
                (await UserDB.clientExists(client, null, null, email)) ||
                (await UserDB.clientExists(client, null, username))
            ) {
                res.status(HTTPStatus.CONFLICT).send(
                    "email/username already exists"
                );
                return;
            }

            const idUser = (
                await UserDB.postUser(
                    client,
                    username,
                    email,
                    await bcrypt.hash(password, 10),
                    firstname,
                    lastname
                )
            ).rows[0].id;

            for (const game in videoGames) {
                const platform = videoGames[game][0];
                const nameId = videoGames[game][1];
                const publicationId = (
                    await publicationDB.getPublicationFromGameAndPlatform(
                        client,
                        nameId,
                        platform
                    )
                ).rows[0].id;
                if (publicationId !== null) {
                    await GamesDB.createGame(
                        client,
                        idUser,
                        publicationId,
                        true
                    );
                } else {
                    //TODO : send a message to the user to tell him that the game was not found
                    console.log(`game ${nameId} not found`);
                }
            }
            client.query("COMMIT");
            res.sendStatus(HTTPStatus.CREATED);
        } catch (error) {
            client.query("ROLLBACK");
            res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
        } finally {
            client.release();
        }
    }
}

/**
 * Get a specific user
 *
 * @param {Request} req need to be fill with an id from the url
 * @param {Response} res if it fails, send an error message, else send the specific user
 *
 * @returns {Promise<void>}
 */
module.exports.getUser = async (req, res) => {
    const id = parseInt(req.params.userId);
    if (isNaN(id)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Id must be a Number");
        return;
    }
    const client = await pool.connect();
    try {
        const user = (await UserDB.getUserFromId(client, id)).rows[0];
        if (user === null) {
            res.status(HTTPStatus.NOT_FOUND).send("User not found");
            return;
        }
        res.status(HTTPStatus.ACCEPTED).json(user);
    } catch (error) {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(
            "Internal server error"
        );
    } finally {
        client.release();
    }
}

/**
 * Get all users
 *
 * @param {Request} req nothing to get from the request
 * @param {Response} res if it fails, send an error message, else send all users
 *
 * @returns {Promise<void>}
 */
module.exports.getUsers = async (req, res) => {
    const client = await pool.connect();
    try {
        const users = await UserDB.getUsers(client);
        res.status(HTTPStatus.ACCEPTED).json(users.rows);
    } catch (error) {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(
            "Internal server error"
        );
    } finally {
        client.release();
    }
}
