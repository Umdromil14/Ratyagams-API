const pool = require("../model/database");
const GameModel = require("../model/game");
const UserModel = require("../model/userDB");
const PublicationModel = require("../model/publication");
const { isValidObject } = require("../tools/utils");
const HTTPStatus = require("../tools/HTTPStatus");


// * FINISHED
/**
 * Check if the ids are valid; if not, return the corresponding HTTP status code
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} userId the id of the user
 * @param {number} publicationId the id of the publication
 * 
 * @returns {Object} the response (keys: HTTPStatus (404, 409), message (string)); if the ids are valid, the status is undefined
 */
async function validateIds(client, userId, publicationId) {
    const [userExists, publicationExists, gameExists] = await Promise.all([
        UserModel.clientExists(client, userId),
        PublicationModel.publicationExists(client, publicationId),
        GameModel.gameExists(client, userId, publicationId)
    ]);

    if (!userExists) {
        return {
            status: HTTPStatus.NOT_FOUND,
            message: "User not found"
        };
    } else if (!publicationExists) {
        return {
            status: HTTPStatus.NOT_FOUND,
            message: "Publication not found"
        };
    } else if (gameExists) {
        return {
            status: HTTPStatus.CONFLICT,
            message: "Game already exists"
        };
    }
}

/**
 * Get all games of a user
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getUserGames = async (req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        return;
    }

    const client = await pool.connect();
    try {
        const { rows: games } = await GameModel.getUserGames(client, userId);
        if (games.length === 0) {
            res.status(HTTPStatus.NOT_FOUND).send("No games found");
        } else {
            res.json(games);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Get a game
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getGame = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const publicationId = parseInt(req.params.publicationId);

    if (isNaN(userId) || isNaN(publicationId)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        return;
    }
    
    const client = await pool.connect();
    try {
        const { rows: games } = await GameModel.getGame(client, userId, publicationId);
        if (games.length === 0) {
            res.status(HTTPStatus.NOT_FOUND).send("No game found");
        } else {
            res.json(games[0]);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Create a new game
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
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
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
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
        const response = await validateIds(client, userId, publicationId);
        if (response !== undefined) {
            res.status(response.status).send(response.message);
        } else {
            await GameModel.createGame(client, userId, publicationId, isOwned, reviewRating, reviewComment, reviewDate);
            res.status(HTTPStatus.CREATED).send("Game created");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Update a game
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
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
    if (!isValidObject(body, model, true)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
        return;
    }

    const {
        user_id: userId,
        publication_id: publicationId,
        new_user_id: newUserId,
        new_publication_id: newPublicationId
    } = body;
    const updateValues = {
        user_id: newUserId,
        publication_id: newPublicationId,
        is_owned: body.is_owned,
        review_rating: body.review_rating,
        review_comment: body.review_comment,
        review_date: body.review_date
    };

    const client = await pool.connect();
    try {
        if (!await GameModel.gameExists(client, userId, publicationId)) {
            res.status(HTTPStatus.NOT_FOUND).send("Game not found");
        } else{
            const userIdToTest = newUserId ?? userId;
            const publicationIdToTest = newPublicationId ?? publicationId;

            if (userIdToTest !== userId || publicationIdToTest !== publicationId) {
                const response = await validateIds(client, userIdToTest, publicationIdToTest);
                if (response !== undefined) {
                    res.status(response.status).send(`New ${response.message}`);
                    return;
                }
            }
            await GameModel.updateGame(client, userId, publicationId, updateValues);
            res.sendStatus(HTTPStatus.NO_CONTENT);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Delete a game
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.deleteGame = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const publicationId = parseInt(req.params.publicationId);

    if (isNaN(userId) || isNaN(publicationId)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        return;
    }

    const client = await pool.connect();
    try {
        if (await GameModel.gameExists(client, userId, publicationId)) {
            await GameModel.deleteGame(client, userId, publicationId);
            res.sendStatus(HTTPStatus.NO_CONTENT);
        } else {
            res.status(HTTPStatus.NOT_FOUND).send("Game not found");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Delete all games of a user
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.deleteGamesFromUser = async (req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        return;
    }
    
    const client = await pool.connect();
    try {
        if (await UserModel.clientExists(client, userId)) {
            await GameModel.deleteGamesFromUser(client, userId);
            res.sendStatus(HTTPStatus.NO_CONTENT);
        } else {
            res.status(HTTPStatus.NOT_FOUND).send("User not found");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}