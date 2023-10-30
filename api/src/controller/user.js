const pool = require("../model/database");
const UserModel = require("../model/user.js");
const UserDB = require("../model/userDB.js");
const GamesDB = require("../model/game.js");
const PublicationController = require("./publication.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tools = require("../tools.js");

//post : login with a account that already exists
//pre : username or email and password
module.exports.login = async (req, res) => {
    const { username: username, email: email, password: password } = req.body;
    if (
        (username === undefined && email === undefined) ||
        password === undefined
    ) {
        res.status(400).send("Missing parameters");
        return;
    }
    if (email && !tools.isValidEmail(email)) {
        res.status(400).send("Wrong email format");
        return;
    }
    const client = await pool.connect();
    try {
        const user = await UserModel.getUser(client, username, email);
        if (user === null) {
            res.status(401).send("User does not exist");
        } else if (!(await bcrypt.compare(password, user.hashed_password))) {
            res.status(401).send("Wrong password or username/email");
        } else {
            const token = jwt.sign(
                {
                    data: user,
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
        res.status(500).send("Internal server error");
    } finally {
        client.release();
    }
};

//post : create a new account
//pre : username, email, password, firstname(optionnal), lastname(optionnal) from body (form)
module.exports.postUser = async (req, res) => {
    const { username, email, firstname, lastname, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).send("Missing parameters");
        return;
    }
    if (!tools.isValidEmail(email)) {
        res.status(400).send("Wrong email format");
        return;
    }
    const client = await pool.connect();
    try {
        const user = await UserModel.getUser(client, username, email);

        if (user !== null) {
            res.status(409).send("email/username already exists"); // ! 409 ??
            return;
        }

        await UserDB.postUser(
            client,
            username,
            email,
            bcrypt.hashSync(password, 10),
            firstname,
            lastname
        );

        res.status(200).send("created");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    } finally {
        client.release();
    }
};

//post : delete a account with an id get from params (build link in react)
//pre : id from params
module.exports.deleteUserAdmin = async (req, res) => {
    const id = parseInt(req.params.userId);
    if (isNaN(id)) {
        res.status(400).send("Wrong id format");
        return;
    }
    const client = await pool.connect();
    try {
        const userExist = await UserDB.clientExists(client, id);
        //! TODO si delete compte admin ????
        if (!userExist) {
            res.status(404).send("User not found");
            return;
        }
        client.query("BEGIN");

        await GamesDB.deleteUserGames(client, id);
        await UserDB.deleteUser(client, id);

        await client.query("COMMIT");

        res.status(200).send("deleted");
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).send("Internal server error");
    } finally {
        client.release();
    }
};

//post : delete a account with an id get from token
//pre : token (readable from the middleware identification)

module.exports.deleteMyAccount = async (req, res) => {
    const actualUserId = req.session.data.id;
    const client = await pool.connect();
    try {
        if (!(await UserDB.clientExists(client, actualUserId))) {
            res.status(404).send("User not found");
            return;
        }
        client.query("BEGIN");

        await GamesDB.deleteUserGames(client, actualUserId);
        await UserDB.deleteUser(client, actualUserId);

        await client.query("COMMIT");
        res.status(200).send("deleted");
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).send("Internal server error");
    } finally {
        client.release();
    }
};

//post : update a account with an id get from params (build link in react)
//pre : id from params and username, email, firstname, lastname and password from body (form)
module.exports.updateUserAdmin = async (req, res) => {
    const id = parseInt(req.params.userId);
    if (isNaN(id)) {
        res.status(400).send("Wrong id format");
        return;
    }
    const userOBJ = req.body;
    if (userOBJ.email && !tools.isValidEmail(userOBJ.email)) {
        res.status(400).send("Wrong email format");
        return;
    }
    const newData = {};
    const client = await pool.connect();
    try {
        let user = await UserDB.getUserById(client, id);
        user = user.rows[0];
        if (user === null) {
            res.status(404).send("User not found");
            return;
        }

        newData.username = userOBJ.username ? userOBJ.username : user.username;
        newData.email = userOBJ.email ? userOBJ.email : user.email;
        newData.firstname = userOBJ.firstname
            ? userOBJ.firstname
            : user.firstname;
        newData.lastname = userOBJ.lastname ? userOBJ.lastname : user.lastname;
        newData.password = userOBJ.password
            ? bcrypt.hashSync(userOBJ.password, 10)
            : user.hashed_password;

        await UserDB.updateUser(
            client,
            id,
            newData.username,
            newData.email,
            newData.firstname,
            newData.lastname,
            newData.password
        );

        res.status(200).send("updated");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    } finally {
        client.release();
    }
};

//post : update a account with an id get from token
//pre : token and username, email, firstname (optional), lastname (optional) and password from body (form)
module.exports.updateMyAccount = async (req, res) => {
    const actualUserId = req.session.data.id;
    const { username, email, firstname, lastname, password } = req.body;
    //forced to put at least a username,email and a password
    if (
        username === undefined &&
        email === undefined &&
        password === undefined
    ) {
        res.status(400).send("Missing parameters");
    } else if (email && !tools.isValidEmail(email)) {
        res.status(400).send("Wrong email format");
    } else {
        const newData = {};
        const client = await pool.connect();
        try {
            let user = await UserDB.getUserById(client, actualUserId);
            if (user === null) {
                res.status(404).send("User not found");
                return;
            }
            user = user.rows[0];
            newData.username = username ? username : user.username;
            newData.email = email ? email : user.email;
            newData.password = bcrypt.hashSync(password, 10);
            newData.firstname = firstname ? firstname : user.firstname;
            newData.lastname = lastname ? lastname : user.lastname;
            //check if username or email already exists

            // si l'email ou le username n'est pas le même que celui de l'utilisateur
            //ou si garde le même email et/ou username
            if (
                !(await UserDB.clientExists(
                    client,
                    null,
                    null,
                    newData.email
                )) ||
                !(await UserDB.clientExists(client, null, newData.username)) ||
                user.username === newData.username ||
                user.email === newData.email
            ) {
                await UserDB.updateUser(
                    client,
                    actualUserId,
                    newData.username,
                    newData.email,
                    newData.firstname,
                    newData.lastname,
                    newData.password
                );
                res.status(200).send("updated");
            } else {
                res.status(409).send("Username or email already exists"); // ! 409 ??
                return;
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal server error");
        } finally {
            client.release();
        }
    }
};

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
    } else if (!tools.isValidEmail(email)) {
        res.status(400).send("Wrong email format");
    } else {
        const client = await pool.connect();
        try {
            client.query("BEGIN");
            if (
                (await UserDB.clientExists(client, null, null, email)) &&
                (await UserDB.clientExists(client, null, username))
            ) {
                res.status(409).send("email/username already exists"); // ! 409 ??
                return;
            }
            let idUser = await UserDB.postUser(
                client,
                username,
                email,
                bcrypt.hashSync(password, 10),
                firstname,
                lastname
            );
            idUser = idUser.rows[0].id;

            for (const game in videoGames) {
                const platform = videoGames[game][0];
                const name = videoGames[game][1];
                const publicationId =
                    await PublicationController.getPublicationId(
                        client,
                        name,
                        platform
                    );
                if (publicationId !== null) {
                    await GamesDB.createGame(client, idUser, publicationId);
                } else {
                    //TODO : send a message to the user to tell him that the game was not found
                    console.log(`game ${name} not found`);
                }
            }
            client.query("COMMIT");
            res.sendStatus(201);
        } catch (error) {
            client.query("ROLLBACK");
            console.error(error);
            res.status(500).send("Internal server error");
        } finally {
            client.release();
        }
    }
};

module.exports.getUserById = async (req, res) => {
    const id = parseInt(req.params.userId);
    if (isNaN(id)) {
        res.status(400).send("Wrong id format");
        return;
    }
    const client = await pool.connect();
    try {
        const user = await UserDB.getUserById(client, id);
        if (user === null) {
            res.status(404).send("User not found");
            return;
        }
        res.status(200).json(user.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    } finally {
        client.release();
    }
};

module.exports.getUsers = async (req, res) => {
    const client = await pool.connect();
    try {
        const users = await UserDB.getUsers(client);
        res.status(200).json(users.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    } finally {
        client.release();
    }
};
