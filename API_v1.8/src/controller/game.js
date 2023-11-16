/**
 * @swagger
 * components:
 *  schemas:
 *      Game:
 *          type: object
 *          properties:
 *              user_id:
 *                  type: integer
 *                  description: The id of the user
 *              publication_id:
 *                  type: integer
 *                  description: The id of the publication
 *              is_owned:
 *                  type: boolean
 *                  description: Whether the user owns the game 
 *              review_rating:
 *                  type: integer
 *                  description: The user's rating of the game
 *              review_comment:
 *                  type: string
 *                  description: The user's comment on the game
 *              review_date:
 *                  type: string
 *                  format: date
 *                  description: The date of the user's review
 */

/**
 * @swagger
 * components:
 *  responses:
 *      GamesFound:
 *          description: Games were found
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Game'
 */

/**
 * @swagger
 * components:
 *  responses:
 *      GameFound:
 *          description: A game was found
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Game'
 */

/**
 * @swagger
 * components:
 *  responses:
 *      GameAdded:
 *          description: The game was added
 *  requestBodies:
 *      GameToAdd:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          user_id:
 *                              type: integer
 *                              description: The id of the user
 *                          publication_id:
 *                              type: integer
 *                              description: The id of the publication
 *                          is_owned:
 *                              type: boolean
 *                              description: Whether the user owns the game
 *                          review_rating:
 *                              type: integer
 *                              description: The user's rating of the game
 *                          review_comment:
 *                              type: string
 *                              description: The user's comment on the game
 *                          review_date:
 *                              type: string
 *                              format: date
 *                              description: The date of the user's review
 *                      required:
 *                          - user_id
 *                          - publication_id
 */

/**
 * @swagger
 * components:
 *  responses:
 *      GameUpdated:
 *          description: The game was updated
 *  requestBodies:
 *      GameToUpdate:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          user_id:
 *                              type: integer
 *                              description: The id of the user
 *                          publication_id:
 *                              type: integer
 *                              description: The id of the publication
 *                          is_owned:
 *                              type: boolean
 *                              description: Whether the user owns the game
 *                          review_rating:
 *                              type: integer
 *                              description: The user's rating of the game
 *                          review_comment:
 *                              type: string
 *                              description: The user's comment on the game
 *                          review_date:
 *                              type: string
 *                              format: date
 *                              description: The date of the user's review
 */

/**
 * @swagger
 * components:
 *  responses:
 *      GameDeleted:
 *          description: The game was deleted
 */

const pool = require("../model/database");
const GameModel = require("../model/game");
const UserModel = require("../model/userDB");
const PublicationModel = require("../model/publication");
const { isValidObject } = require("../tools/utils");
const HTTPStatus = require("../tools/HTTPStatus");

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
 * Get all games
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getAllGames = async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows: games } = await GameModel.getAllGames(client);
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

// TODO use id en session
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

// TODO use id en session
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
    };

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

// TODO use id en session
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
        user_id: ["number", "optional"],
        publication_id: ["number", "optional"],
        is_owned: ["boolean", "optional"],
        review_rating: ["number", "optional"],
        review_comment: ["string", "optional"],
        review_date: ["date", "optional"]
    };

    const userId = parseInt(req.params.userId);
    const publicationId = parseInt(req.params.publicationId);
    const body = req.body;

    if (isNaN(userId) || isNaN(publicationId)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        return;
    }
    if (!isValidObject(body, model, true)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
        return;
    }

    const { user_id: newUserId, publication_id: newPublicationId } = body;

    const client = await pool.connect();
    try {
        const userIdToTest = newUserId ?? userId;
        const publicationIdToTest = newPublicationId ?? publicationId;

        if (userIdToTest !== userId || publicationIdToTest !== publicationId) {
            const response = await validateIds(client, userIdToTest, publicationIdToTest);
            if (response !== undefined) {
                res.status(response.status).send(`New ${response.message}`);
                return;
            }
        }

        const { rowCount } = await GameModel.updateGame(client, userId, publicationId, body);
        if (rowCount) {
            res.sendStatus(HTTPStatus.NO_CONTENT);
        } else {
            res.status(HTTPStatus.NOT_FOUND).send("Game not found");
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

// TODO use id en session
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
        const { rowCount } = await GameModel.deleteGame(client, userId, publicationId);
        if (rowCount) {
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