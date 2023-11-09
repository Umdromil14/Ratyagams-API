/**
 * @swagger
 * components:
 *  getAllUsers:
 *  login:
 *  postUser:
 *  postUserWithGames:
 *  updateMyAccount:
 *  updateUserFromAdmin:
 *  deleteMyAccount:
 *  deleteUserFromAdmin:
 *  getUser:
 *  
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
    const { username, email, password } = req.body;
    const model = {
        username: ["string", "optional"],
        email: ["string", "optional"],
        password: ["string"],
    };
    if (!tools.isValidObject(req.body, model, true)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Missing parameters");
        return;
    }
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
            return ;
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
        res.json({ token });
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
    const { username, email, firstname, lastname, password } = req.body;

    if (!username || !email || !password) {
        res.status(HTTPStatus.NOT_FOUND).send("Missing parameters");
        return;
    }
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
        console.error(error);
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
        res.status(HTTPStatus.BAD_REQUEST).send("Wrong id format");
        return;
    }
    const client = await pool.connect();
    try {
        const userExist = await UserDB.clientExists(client, id);
        if (!userExist) {
            res.status(HTTPStatus.NOT_FOUND).send("User not found");
            return;
        }
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
        if (!(await UserDB.clientExists(client, actualUserId))) {
            res.status(HTTPStatus.NOT_FOUND).send("User not found");
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
}


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
        res.status(HTTPStatus.BAD_REQUEST).send("Wrong id format");
        return;
    }
    const {
        username,
        email,
        firstname, 
        lastname,
        password,
    } = req.body;

    if (!tools.isValidEmail(email)) {
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

        if (userOBJ.username !== username) {
            if (await UserDB.clientExists(client, undefined, username)) {
                res.status(HTTPStatus.CONFLICT).send("Username already exists");
                return;
            }
        }
        if (userOBJ.email !== email){
            if (await UserDB.clientExists(client, undefined, undefined, email)) {
                res.status(HTTPStatus.CONFLICT).send("Email already exists");
                return;
            }
        }

        const newPassword = password ? await bcrypt.hash(password, 10) : undefined;

        await UserDB.updateUser(
            client,
            id,
            username,
            email,
            firstname,
            lastname,
            newPassword
        );

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
        email: ["string" ],
        firstname: ["string", "optional"],
        lastname: ["string", "optional"],
    };
    const actualUser = req.session.data;
    const { username, email, firstname, lastname } = req.body;
    if (!tools.isValidObject(req.body, model)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Missing parameters");
        return;
    }
    if (!tools.isValidEmail(email)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Wrong email format");
        return;
    }
    const client = await pool.connect();

    try {

        if (actualUser.username !== username && await UserDB.clientExists(client, undefined, username)) {
            res.status(HTTPStatus.CONFLICT).send("Username already exists");
            return;
        }

        if (actualUser.email !== email && await UserDB.clientExists(client, undefined, undefined, email)){
            res.status(HTTPStatus.CONFLICT).send("Email already exists");
            return;
        }

        await UserDB.updateUser(
            client,
            actualUser.id,
            username,
            email,
            firstname,
            lastname
        );

        const token = jwt.sign(
            {
                data: {
                    id: actualUser.id,
                    username,
                    email,
                    firstname,
                    lastname,
                    hashedPassword: actualUser.hashedPassword,
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
        games: ["object"]
    };
    const {
        username,
        email,
        firstname,
        lastname,
        password,
        games: videoGames
    } = req.body;
    if (!tools.isValidObject(req.body, model)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Missing parameters");
        return;
    }
    if (!tools.isValidEmail(email)) {
        res.status(HTTPStatus.NOT_FOUND).send("Wrong email format");
    } else {
        const client = await pool.connect();
        try {
            client.query("BEGIN");
            if (
                (await UserDB.clientExists(client, null, null, email)) ||
                (await UserDB.clientExists(client, null, username))
            ) {
                res.status(HTTPStatus.CONFLICT).send("email/username already exists");
                return;
            }

            const idUser = (await UserDB.postUser(
                client,
                username,
                email,
                await bcrypt.hash(password, 10),
                firstname,
                lastname
            )).rows[0].id;

            for (const game in videoGames) {
                const platform = videoGames[game][0];
                const nameId = videoGames[game][1];
                const publicationId =
                    (await publicationDB.getPublicationFromGameAndPlatform(
                        client,
                        nameId,
                        platform
                    )).rows[0].id;
                if (publicationId !== null) {
                    await GamesDB.createGame(client, idUser, publicationId,true);
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
        res.status(HTTPStatus.BAD_REQUEST).send("Wrong id format");
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
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send("Internal server error");
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
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send("Internal server error");
    } finally {
        client.release();
    }
}