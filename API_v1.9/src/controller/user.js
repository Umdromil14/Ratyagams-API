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

const pool = require("../model/database");
const UserDB = require("../model/userDB.js");
const UserModel = require("../model/user.js");
const GamesDB = require("../model/game.js");
const PublicationDB = require("../model/publication.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HTTPStatus = require("../tools/HTTPStatus.js");
const { blacklistToken } = require("../middleware/Identification");
const PGErrors = require("../tools/PGErrors");

const {
    loginSchema,
    userSchema,
    userWithGamesSchema,
    updateMyAccountSchema,
    updateUserSchema,
} = require("../zod/schema/user");

const { validateObject } = require("../zod/zod");
/**
 * Login a user that already exists
 *
 * @param {Request} req from the body need to have username or email and password
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
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
 *                          - login
 *                          - password
 */
module.exports.login = async (req, res) => {
    let login, password;
    try {
        ({ login, password } = validateObject(req.body, loginSchema));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }
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
            return;
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
 *
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
module.exports.postUser = async (req, res) => {
    let username, email, firstname, lastname, password, isAdmin;
    try {
        ({ username, email, firstname, lastname, password, is_admin: isAdmin } =
            validateObject(req.body, userSchema));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }
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
                res.status(HTTPStatus.CONFLICT).send(error.detail);
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
 * Delete a user
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      UserDeleted:
 *          description: The user was deleted
 */
async function deleteUser(id, res) {
    const idUser = parseInt(id);
    if (isNaN(idUser)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Id must be a Number");
        return;
    }
    const client = await pool.connect();
    try {
        if (await UserDB.isAdmin(client, idUser)) {
            res.status(HTTPStatus.FORBIDDEN).send(
                "Can't delete an admin account"
            );
            return;
        }
        client.query("BEGIN");
        await GamesDB.deleteGamesFromUser(client, idUser);
        const { rowCount } = await UserDB.deleteUser(client, idUser);
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
 * Delete a user from an admin account
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.deleteUserFromAdmin = async (req, res) => {
    await deleteUser(req.params.userId, res);
};

/**
 * Delete the user account with his token
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 */
module.exports.deleteMyAccount = async (req, res) => {
    await deleteUser(req.session.id, res);
};

/**
 * Update a user
 * @param {Object} user
 * @param {number} user.id the id of the user
 * @param {string =} user.username the new username of the user
 * @param {string =} user.email the new email of the user
 * @param {string =} user.firstname the new firstname of the user
 * @param {string =} user.lastname the new lastname of the user
 * @param {string =} user.password the new password of the user
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
async function updateUser(id,user, res) {
    if (isNaN(id)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Id must be a Number");
        return;
    }

    console.log(Object.keys(user));

    if (Object.keys(user).length === 0) {
        res.status(HTTPStatus.BAD_REQUEST).send("no values to update");
        return;
    }

    const client = await pool.connect();
    try {
        user.password = user.password
            ? await bcrypt.hash(user.password, 10)
            : undefined;

        const { rowCount } = await UserDB.updateUser(client, user.id, user);
        if (rowCount === 0) {
            res.status(HTTPStatus.NOT_FOUND).send("User not found");
            return;
        }

        res.sendStatus(HTTPStatus.NO_CONTENT);
    } catch (error) {
        switch (error.code) {
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).send(
                    "username/email already exists"
                );
                break;
            default:
                res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
                break;
        }
    } finally {
        client.release();
    }
}

/**
 * Update a user from an admin account
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
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
module.exports.updateUserFromAdmin = async (req, res) => {
    let user;
    try {
        (user = validateObject(req.body, updateUserSchema));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }
    await updateUser(parseInt(req.params.userId),user, res);
};

/**
 * Update the user account with his token
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
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
module.exports.updateMyAccount = async (req, res) => {
    let user;
    try {
        (user = validateObject(req.body, updateMyAccountSchema));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }
    await updateUser(req.session.id,user, res);
};

/**
 * Create a user with games
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
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
module.exports.postUserWithGames = async (req, res) => {
    let username, email, firstname, lastname, password, isAdmin, publicationsIds;
    try {
        ({
            username,
            email,
            firstname,
            lastname,
            password,
            is_admin: isAdmin,
            publications_ids: publicationsIds,
        } = validateObject(req.body, userWithGamesSchema));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }

    const client = await pool.connect();
    try {
        client.query("BEGIN");

        const userId = (
            await UserDB.postUser(
                client,
                username,
                email,
                await bcrypt.hash(password, 10),
                firstname,
                lastname,
                isAdmin
            )
        ).rows[0].id;

        for (const id of publicationsIds) {
            const { rows: publications } = await PublicationDB.getPublication(
                client, id
            );

            if (publications.length === 0) {
                client.query("ROLLBACK");
                res.status(HTTPStatus.NOT_FOUND).send(
                    `Publication with id ${id} not found`
                );
                return;
            }

            await GamesDB.createGame(client, userId, publications[0].id);
        }

        client.query("COMMIT");
        res.sendStatus(HTTPStatus.CREATED);
    } catch (error) {
        console.error(error);
        client.query("ROLLBACK");
        switch (error.code) {
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).send(
                    "email/username already exists"
                );
                break;
            default:
                res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
                break;
        }
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
 *
 * @swagger
 * components:
 *  responses:
 *      UserFound:
 *          description: An user was found
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *
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
        if (!user) {
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
 * @param {Request} _req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
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

/**
 * Get user from his token
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
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
