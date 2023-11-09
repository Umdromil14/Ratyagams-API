const pool = require("../model/database");
const UserModel = require("../model/user.js");
const UserDB = require("../model/userDB.js");
const GamesDB = require("../model/game.js");
const publicationDB = require("../model/publication.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tools = require("../tools/utils.js");
const HTTPStatus = require("../tools/HTTPStatus.js");

//post : login with a account that already exists
//pre : username or email and password
module.exports.login = async (req, res) => {
    const { username, email, password } = req.body;
    if (
        (username === undefined && email === undefined) ||
        password === undefined
    ) {
        res.status(HTTPStatus.NOT_FOUND).send("Missing parameters");
        return;
    }
    if (!tools.isValidEmail(email)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Wrong email format");
        return;
    }
    const client = await pool.connect();
    try {
        const {
            id,
            username: usernameClient,
            email: emailClient,
            firstname,
            lastname,
            hashed_password: hashedPassword,
        } = await UserModel.getUser(client, username, email);

        if (usernameClient === null) {
            res.status(HTTPStatus.NOT_FOUND).send("User does not exist");
        } else if (!(await bcrypt.compare(password, hashedPassword))) {
            res.status(HTTPStatus.BAD_REQUEST).send(
                "Wrong password or username/email"
            );
        } else {
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
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

//post : create a new account
//pre : username, email, password, firstname(optionnal), lastname(optionnal) from body (form)
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

//post : delete a account with an id get from params (build link in react)
//pre : id from params
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
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

//post : delete a account with an id get from token
//pre : token (readable from the middleware identification)

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
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

//post : update a account with an id get from params (build link in react)
//pre : id from params and username, email, firstname, lastname and password from body (form)
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
        const userOBJ = await UserDB.getUserFromId(client, id)[0];

        if (userOBJ === null) {
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
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

//post : update a account with the token (readable from the middleware identification)
//pre : token and username, email, firstname (optional), lastname (optional)
module.exports.updateMyAccount = async (req, res) => {
    const actualUser = req.session.data;
    const { username, email, firstname, lastname } = req.body;
    //forced to put at least a username & email
    if ( !username  && !email) { //! with nathan's model can delete this part
        res.status(HTTPStatus.BAD_REQUEST).send("Missing parameters");
        return;
    }
    if (!tools.isValidEmail(email)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Wrong email format");
        return;
    }
    const client = await pool.connect();

    try {

        if (actualUser.username !== username) {
            if (await UserDB.clientExists(client, undefined, username)) {
                res.status(HTTPStatus.CONFLICT).send("Username already exists");
                return;
            }
        }

        if (actualUser.email !== email){
            if (await UserDB.clientExists(client, undefined, undefined, email)) {
                res.status(HTTPStatus.CONFLICT).send("Email already exists");
                return;
            }
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
        console.log(token);
        res.sendStatus(HTTPStatus.NO_CONTENT);
    } catch (error) {
        console.error(error);
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

//post : create a new account with some new game in the same time
//pre : username, email, password, firstname(optionnal), lastname(optionnal) from body (form) and video_game with his platform from body (form)
//game receive will be an array with only the name of the game and the platform
module.exports.postUserWithGames = async (req, res) => {
    const {
        username,
        email,
        firstname,
        lastname,
        password,
        games: videoGames,
    } = req.body;
    //{ games1: [ 'ps4', 'god of war' ], games2: [ 'ps3', 'god of war 2' ] }

    if (
        (username === undefined && email === undefined) ||
        password === undefined
    ) {
        res.status(400).send("Missing parameters");
        return;
    } //! with nathan's model can delete this part
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
                bcrypt.hashSync(password, 10),
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
            console.error(error);
            res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
        } finally {
            client.release();
        }
    }
}

module.exports.getUserFromId = async (req, res) => {
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
        console.log(user);
        res.status(HTTPStatus.ACCEPTED).json(user);
    } catch (error) {
        console.error(error);
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send("Internal server error");
    } finally {
        client.release();
    }
};

module.exports.getUsers = async (req, res) => {
    const client = await pool.connect();
    try {
        const users = await UserDB.getUsers(client);
        res.status(HTTPStatus.ACCEPTED).json(users.rows);
    } catch (error) {
        console.error(error);
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send("Internal server error");
    } finally {
        client.release();
    }
};


