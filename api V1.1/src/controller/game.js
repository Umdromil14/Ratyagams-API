const pool = require("../model/database");
const GameModel = require("../model/game");
const UserModel = require("../model/userDB");
const { isValidObject } = require("../tools");


module.exports.getUserGames = async (req, res) => {
    const userId = parseInt(req.params.userId);

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
    const publicationId = parseInt(req.params.publicationId);

    if (isNaN(userId) || isNaN(publicationId)) {
        res.status(400).send("Id must be a number");
        return;
    }
    
    const client = await pool.connect();
    try {
        const { rows: games } = await GameModel.getGame(client, userId, publicationId);
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
        user_id: ["number"],
        publication_id: ["number"],
        is_owned: ["boolean", "optional"],
        review_rating: ["number", "optional"],
        review_comment: ["string", "optional"],
        review_date: ["date", "optional"]
    }

    const body = req.body;
    if (!isValidObject(body, model)) {
        res.status(400).send("Invalid body");
        return;
    }

    const {
        user_id: userId,
        publication_id: publicationId,
        is_owned: isOwned,
        review_rating: reviewRating,
        review_comment: reviewComment, 
        review_date: reviewDate
    } = body;

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
        user_id: ["number"],
        publication_id: ["number"],
        new_user_id: ["number", "optional"],
        new_publication_id: ["number", "optional"],
        is_owned: ["boolean", "optional"],
        review_rating: ["number", "optional"],
        review_comment: ["string", "optional"],
        review_date: ["date", "optional"]
    }

    const body = req.body;
    if (!isValidObject(body, model)) {
        res.status(400).send("Invalid body");
        return;
    }

    const {
        user_id: userId,
        publication_id: publicationId,
        new_user_id: newUserId,
        new_publication_id: newPublicationId,
        is_owned: isOwned,
        review_rating: reviewRating,
        review_comment: reviewComment, 
        review_date: reviewDate
    } = body;

    const client = await pool.connect();
    try {
        if (await GameModel.gameExists(client, userId, publicationId)) {
            await GameModel.updateGame(client, userId, publicationId, newUserId, newPublicationId, isOwned, reviewRating, reviewComment, reviewDate);
            res.status(200).send("Game updated");
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

// ? ask if delete params in body or in url
module.exports.deleteGame = async (req, res) => {
    const model = {
        user_id: ["number"],
        publication_id: ["number"]
    }

    const body = req.body;
    if (!isValidObject(body, model)) {
        res.status(400).send("Invalid body");
        return;
    }

    const { user_id: userId, publication_id: publicationId } = body;
    const client = await pool.connect();
    try {
        if (await GameModel.gameExists(client, userId, publicationId)) {
            await GameModel.deleteGame(client, userId, publicationId);
            res.status(200).send("Game deleted");
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

// ? ask if delete params in body or in url
module.exports.deleteGamesByUser = async (req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        res.status(400).send("Id must be a number");
        return;
    }
    
    const client = await pool.connect();
    try {
        if (await UserModel.clientExists(client, userId)) {
            await GameModel.deleteGamesByUser(client, userId);
            res.status(200).send("Games deleted");
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