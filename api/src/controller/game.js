const pool = require("../model/database");
const GameModel = require("../model/game");
const UserModel = require("../model/userDB");
const { isValidObject } = require("../tools");


module.exports.getUserGames = async (req, res) => {
    const userId = parseInt(req.params.userUserI);

    if (isNaN(userId)) {
        res.status(400).send("Id must be a number");
        return;
    }

    const client = await pool.connect();
    try {
        const { rows: games } = await GameModel.getUserGames(client, userId);
        if (games.length === 0) {
            res.status(404).send("No games found");
        } else {
            res.json(games);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getGame = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const gameId = parseInt(req.params.gameId);

    if (isNaN(userId) || isNaN(gameId)) {
        res.status(400).send("Id must be a number");
        return;
    }
    
    const client = await pool.connect();
    try {
        const { rows: games } = await GameModel.getGame(client, userId, gameId);
        if (games.length === 0) {
            res.status(404).send("No game found");
        } else {
            res.json(games[0]);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.postGame = async (req, res) => {
    const model = {
        userId: ["number"],
        publicationId: ["number"],
        isOwned: ["boolean", "optional"],
        reviewRating: ["number", "optional"],
        reviewComment: ["string", "optional"],
        reviewDate: ["date", "optional"]
    }

    const body = req.body;
    if (!isValidObject(body, model)) {
        res.status(400).send("Invalid body");
        return;
    }

    const { userId, publicationId, isOwned, reviewRating, reviewComment, reviewDate } = body;
    const client = await pool.connect();
    try {
        // TODO check if publicationId is a publication
        if (!await UserModel.clientExists(client, userId)) {
            res.status(404).send("User not found");
        } else if (await GameModel.gameExists(client, userId, publicationId)) {
            res.status(409).send("Game already exists");
        } else {
            await GameModel.createGame(client, userId, publicationId, isOwned, reviewRating, reviewComment, reviewDate);
            res.status(201).send("Game created");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.updateGame = async (req, res) => {
    const model = {
        userId: ["number"],
        publicationId: ["number"],
        newUserId: ["number", "optional"],
        newPublicationId: ["number", "optional"],
        isOwned: ["boolean", "optional"],
        reviewRating: ["number", "optional"],
        reviewComment: ["string", "optional"],
        reviewDate: ["date", "optional"]
    }

    const body = req.body;
    if (!isValidObject(body, model)) {
        res.status(400).send("Invalid body");
        return;
    }

    const { userId, publicationId, newUserId, newPublicationId, isOwned, reviewRating, reviewComment, reviewDate } = body;
    const client = await pool.connect();
    try {
        if (await GameModel.gameExists(client, userId, publicationId)) {
            if (newUserId !== undefined || newPublicationId !== undefined || isOwned !== undefined || reviewRating !== undefined || reviewComment !== undefined || reviewDate !== undefined) {
                await GameModel.updateGame(client, userId, publicationId, newUserId, newPublicationId, isOwned, reviewRating, reviewComment, reviewDate);
            }
            res.status(204).send("Game updated");
        } else {
            res.status(404).send("Game not found");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

// TODO ask if delete params in body or in url
module.exports.deleteGame = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const gameId = parseInt(req.params.gameId);

    if (isNaN(userId) || isNaN(gameId)) {
        res.status(400).send("Id must be a number");
        return;
    }
    
    const client = await pool.connect();
    try {
        if (await GameModel.gameExists(client, userId, gameId)) {
            await GameModel.deleteGame(client, userId, gameId);
            res.status(204).send("Game deleted");
        } else {
            res.status(404).send("Game not found");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

// TODO ask if delete params in body or in url
module.exports.deleteUserGames = async (req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        res.status(400).send("Id must be a number");
        return;
    }
    
    const client = await pool.connect();
    try {
        if (await UserModel.clientExists(client, userId)) {
            await GameModel.deleteUserGames(client, userId);
            res.status(204).send("Games deleted");
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}