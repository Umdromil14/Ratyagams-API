/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The id of the user
 *              username:
 *                  type: string
 *                  description: The username of the user
 *              email:
 *                  type: string
 *                  description: The email of the user
 *              firstname:
 *                  type: string
 *                  description: The firstname of the user
 *              lastname:
 *                  type: string
 *                  description: The lastname of the user
 *              hashed_password:
 *                  type: string
 *                  description: The hashed password of the user
 *              is_admin:
 *                  type: boolean
 *                  description: The admin status of the user
 */

/**
 * @swagger
 * components:
 *  responses:
 *      LoginSuccess:
 *          description: Token generated
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          token:
 *                              type: string
 *                              description: The token of the user
 *  requestBodies:
 *      Login:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          login:
 *                              type: string
 *                              description: The username or email of the user
 *                          password:
 *                              type: string
 *                              description: The password of the user
 *                      required:
 *                          - loginrea
 *                          - password
 */

/**
 * @swagger
 * components:
 *  responses:
 *      UserAdded:
 *          description: The user was added
 *  requestBodies:
 *      UserToAdd:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              description: The username of the user
 *                          email:
 *                              type: string
 *                              description: The email of the user
 *                          firstname:
 *                              type: string
 *                              description: The firstname of the user
 *                          lastname:
 *                              type: string
 *                              description: The lastname of the user
 *                          password:
 *                              type: string
 *                              description: The password of the user
 *                          is_admin:
 *                              type: boolean
 *                              description: The admin status of the user
 *                      required:
 *                          - username
 *                          - email
 *                          - password
 */

/**
 * @swagger
 * components:
 *  responses:
 *      UserDeleted:
 *          description: The user was deleted
 */

/**
 * @swagger
 * components:
 *  responses:
 *      UserAndTokenUpdated:
 *          description: The user was updated
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          token:
 *                              type: string
 *                              description: The new token of the user
 *  requestBodies:
 *      UserToUpdateFromToken:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              description: The username of the user
 *                          email:
 *                              type: string
 *                              description: The email of the user
 *                          firstname:
 *                              type: string
 *                              description: The firstname of the user
 *                          lastname:
 *                              type: string
 *                              description: The lastname of the user
 */

/**
 * @swagger
 * components:
 *  responses:
 *      UserUpdated:
 *          description: The user was updated
 *  requestBodies:
 *      UserToUpdateFromAdmin:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              description: The username of the user
 *                          email:
 *                              type: string
 *                              description: The email of the user
 *                          firstname:
 *                              type: string
 *                              description: The firstname of the user
 *                          lastname:
 *                              type: string
 *                              description: The lastname of the user
 *                          password:
 *                              type: string
 *                              description: The password of the user
 *                          is_admin:
 *                              type: boolean
 *                              description: The admin status of the user
 */

/**
 * @swagger
 * components:
 *  responses:
 *      UserAddedWithGames:
 *          description: The user was added with games
 *  requestBodies:
 *      UserToAddWithGames:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              description: The username of the user
 *                          email:
 *                              type: string
 *                              description: The email of the user
 *                          firstname:
 *                              type: string
 *                              description: The firstname of the user
 *                          lastname:
 *                              type: string
 *                              description: The lastname of the user
 *                          password:
 *                              type: string
 *                              description: The password of the user
 *                          is_admin:
 *                              type: boolean
 *                              description: The admin status of the user
 *                          publication_ids:
 *                              type: array
 *                              items:
 *                                  type: integer
 *                                  description: The ids of the publications
 *                      required:
 *                          - username
 *                          - email
 *                          - password
 *                          - publication_ids
 */

/**
 * @swagger
 * components:
 *  responses:
 *      UserFound:
 *          description: An user was found
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * components:
 *  responses:
 *      UsersFound:
 *          description: Users were found
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/User'
 */

const pool = require("../model/database");
const UserDB = require("../model/userDB.js");
const UserModel = require("../model/user.js");
const GamesDB = require("../model/game.js");
const PublicationDB = require("../model/publication.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HTTPStatus = require("../tools/HTTPStatus.js");
const { blacklistToken } = require("../middleware/Identification");

const {
    loginSchema,
    userSchema,
    userSchemaWithGames,
    updateMyAccountSchema,
} = require("../schema/user.js");

/**
 * Login a user that already exists
 *
 * @param {Request} req from the body need to have username or email and password
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.login = async (req, res) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        res.status(HTTPStatus.BAD_REQUEST).send(
            result.error.issues
                .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
                .join(" & ")
        );
        return;
    }
    const { login, password } = result.data;
    const client = await pool.connect();
    try {
        let user;
        if (login.includes("@")) {
            user = (await UserDB.getUserFromEmail(client, login)).rows[0];
        } else {
            user = (await UserDB.getUserFromUsername(client, login)).rows[0];
        }

        if (!user) {
            res.status(HTTPStatus.NOT_FOUND).send("User not found");
        }

        const { id, hashed_password: hashedPassword, is_admin: isAdmin } = user;

        if (!(await bcrypt.compare(password, hashedPassword))) {
            res.status(HTTPStatus.UNAUTHORIZED).send(
                "Wrong password or username/email"
            );
            return;
        }

        const token = jwt.sign(
            {
                data: {
                    id,
                    isAdmin,
                },
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRATION + "s",
            }
        );

        res.json({ token });
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};

/**
 * Create a new user
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.postUser = async (req, res) => {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
        res.status(HTTPStatus.BAD_REQUEST).send(
            result.error.issues
                .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
                .join(" & ")
        );
        return;
    }
    const {
        username,
        email,
        firstname,
        lastname,
        password,
        is_admin: isAdmin,
    } = result.data;

    const client = await pool.connect();

    try {
        await UserDB.postUser(
            client,
            username,
            email,
            await bcrypt.hash(password, 10),
            firstname,
            lastname,
            isAdmin
        );

        res.sendStatus(HTTPStatus.CREATED);
    } catch (error) {
        switch (error.code) {
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(
                    "Internal server error"
                );
                break;
            default:
                console.error(error);
                res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
                break;
        }
    } finally {
        client.release();
    }
};

/**
 * Delete a user from an admin account
 *
 * @param {Request} req
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
};

/**
 * Delete the user account with his token
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.deleteMyAccount = async (req, res) => {
    const headerAuth = req.get("authorization");
    const { id } = req.session;
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
        await UserDB.deleteUser(client, id);

        await client.query("COMMIT");
        //! blacklister le token
        res.sendStatus(HTTPStatus.NO_CONTENT);
    } catch (error) {
        await client.query("ROLLBACK");
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }

    // TODO blacklist token
};

/**
 * Update a user from an admin account
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.updateUserFromAdmin = async (req, res) => {
    const result = updateMyAccountSchema.safeParse(req.body);
    if (!result.success) {
        res.status(HTTPStatus.BAD_REQUEST).send(
            result.error.issues
                .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
                .join(" & ")
        );
        return;
    }
    const id = parseInt(req.params.userId);
    if (isNaN(id)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Id must be a Number");
        return;
    }
    const body = req.body;
    const client = await pool.connect();

    try {
        const user = (await UserDB.getUserFromId(client, id)).rows[0];
        if (!user) {
            res.status(HTTPStatus.NOT_FOUND).send("User not found");
            return;
        }

        if (
            username &&
            username !== user.username &&
            (await UserDB.clientExists(client, undefined, username))
        ) {
            res.status(HTTPStatus.CONFLICT).send("Username already exists");
            return;
        }
        if (
            email &&
            email !== user.email &&
            (await UserDB.clientExists(client, undefined, undefined, email))
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
};

/**
 * Update the user account with his token
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.updateMyAccount = async (req, res) => {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
        res.status(HTTPStatus.BAD_REQUEST).send(
            result.error.issues
                .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
                .join(" & ")
        );
        return;
    }
    const body = result.data;

    const { username, email } = body;
    const client = await pool.connect();

    try {
        const { id, isAdmin } = req.session;
        const user = (await UserDB.getUserFromId(client, id)).rows[0];

        if (
            username &&
            username !== user.username &&
            (await UserDB.clientExists(client, undefined, username))
        ) {
            res.status(HTTPStatus.CONFLICT).send("Username already exists");
            return;
        }
        if (
            email &&
            email !== user.email &&
            (await UserDB.clientExists(client, undefined, undefined, email))
        ) {
            res.status(HTTPStatus.CONFLICT).send("Email already exists");
            return;
        }

        await UserDB.updateUser(client, id, body);

        const token = jwt.sign(
            {
                data: {
                    id,
                    isAdmin,
                },
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );
        res.json({ token });
    } catch (error) {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
    // TODO blacklist token
};

/**
 * Create a user with games
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.postUserWithGames = async (req, res) => {
    // TODO 

    const result = userSchemaWithGames.safeParse(req.body);
    if (!result.success) {
        res.status(HTTPStatus.BAD_REQUEST).send(
            result.error.issues
                .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
                .join(" & ")
        );
        return;
    }
    const {
        username,
        email,
        firstname,
        lastname,
        password,
        is_admin,
        publication_id: publicationIds,
    } = result.data;

    const client = await pool.connect();
    try {
        const user = await UserModel.getUser(client, username, email);
        if (user) {
            res.status(HTTPStatus.CONFLICT).send("email/username already exists");
            return;
        }

        client.query("BEGIN");

        const userId = (
            await UserDB.postUser(
                client,
                username,
                email,
                await bcrypt.hash(password, 10),
                firstname,
                lastname,
                is_admin
            )
        ).rows[0].id;

        let gamesCreatedCount = 0;

        for (const id of publicationIds) {
            if (!isNaN(id)) {
                const { rows: publications } =
                    await PublicationDB.getPublication(id);

                if (publications.length !== 0) {
                    await GamesDB.createGame(
                        client,
                        userId,
                        publications[0].id
                    );

                    gamesCreatedCount++;
                }
            }
        }

        client.query("COMMIT");
        res.status(HTTPStatus.CREATED).send(
            `User created with ${gamesCreatedCount} game(s)`
        );
    } catch (error) {
        client.query("ROLLBACK");
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};

/**
 * Get a specific user
 *
 * @param {Request} req
 * @param {Response} res
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
            res.status(HTTPStatus.NOT_FOUND).send("No user found");
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(
            "Internal server error"
        );
    } finally {
        client.release();
    }
};

/**
 * Get all users
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.getAllUsers = async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows: users } = await UserDB.getAllUsers(client);
        if (users.length === 0) {
            res.status(HTTPStatus.NOT_FOUND).send("No user found");
        } else {
            res.json(users); 
        }
    } catch (error) {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(
            "Internal server error"
        );
    } finally {
        client.release();
    }
};

// TODO swagger
/**
 * Get user from his token
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.getUserFromToken = async (req, res) => {
    const { id } = req.session;
    const client = await pool.connect();
    try {
        const { rows: users } = await UserDB.getUserFromId(client, id);
        if (users.length === 0) {
            blacklistToken(req.headers.authorization.split(" ")[1]); // TODO à voir si on blacklist le token
            res.status(HTTPStatus.NOT_FOUND).send("No user found");
        } else {
            const { id, username, email, firstname, lastname } = users[0];
            res.json({ id, username, email, firstname, lastname });
        }
    } catch (error) {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send(
            "Internal server error"
        );
    } finally {
        client.release();
    }
};
