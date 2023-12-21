const pool = require("../model/database");
const GameModel = require("../model/game");
const HTTPStatus = require("../tools/HTTPStatus");
const PGErrors = require("../tools/PGErrors");
const { validateObject } = require("../zod/zod");
const {
    gameToGetSchema: gameToGetSchema,
    gameSchema,
} = require("../zod/schema/game");

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
 *                  description: The date of the user's review (YYYY-MM-DD or MM-DD-YYYY)
 */

/**
 * Get games
 *
 * @param {string|number=} userId the id of the user
 * @param {string|number=} publicationId the id of the publication
 * @param {string|number=} videoGameId the id of the video game
 * @param {number=} page the chosen page
 * @param {number=} limit the number of games per page
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
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
async function getGame(userId, publicationId, videoGameId, page, limit, res) {
    try {
        ({ userId, videoGameId, publicationId, page, limit } = validateObject(
            { userId, videoGameId, publicationId, page, limit },
            gameToGetSchema.partial()
        ));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            code: "INVALID_INPUT",
            message: error.message,
        });
        return;
    }

    const client = await pool.connect();
    try {
        const { rows: games } = await GameModel.getGames(
            client,
            userId,
            publicationId,
            videoGameId,
            page,
            limit
        );
        if (games.length === 0) {
            res.status(HTTPStatus.NOT_FOUND).json({
                code: "RESOURCE_NOT_FOUND",
                message: "No games found",
            });
            return;
        }
        res.json(games);
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Get one or more games based on query parameters; request from an admin
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.getGameFromAdmin = async (req, res) => {
    await getGame(
        req.query.userId,
        req.query.publicationId,
        req.query.videoGameId,
        req.query.page,
        req.query.limit,
        res
    );
};

/**
 * Get one or more games based on query parameters; request from an user
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.getGameFromUser = async (req, res) => {
    await getGame(
        req.session.id,
        req.query.publicationId,
        req.query.videoGameId,
        req.query.page,
        req.query.limit,
        res
    );
};

/**
 * Get the number of games
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 * @swagger
 * components:
 *  responses:
 *      GamesCount:
 *          description: The number of games
 *          content:
 *             application/json:
 *                  schema:
 *                      type: string
 *                      description: The number of games
 */
module.exports.getGameCount = async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows: games } = await GameModel.getGamesCount(client);
        res.json(games[0].no);
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};

/**
 * Create a new game
 *
 * @param {Object} game the values of the game
 * @param {number} game.user_id the id of the user
 * @param {number} game.publication_id the id of the publication
 * @param {boolean=} game.is_owned whether the user owns the game
 * @param {number=} game.review_rating the rating the user gave to the game
 * @param {string=} game.review_comment the comment the user gave to the game
 * @param {string|Date=} game.review_date the date the user gave the review
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      GameAdded:
 *          description: The game was added
 */
async function addGame(game, res) {
    try {
        game = validateObject(game, gameSchema);
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            code: "INVALID_INPUT",
            message: error.message,
        });
        return;
    }
    const {
        user_id: userId,
        publication_id: publicationId,
        is_owned: isOwned,
        review_rating: reviewRating,
        review_comment: reviewComment,
        review_date: reviewDate,
    } = game;

    const client = await pool.connect();
    try {
        await GameModel.createGame(
            client,
            userId,
            publicationId,
            isOwned,
            reviewRating,
            reviewComment,
            reviewDate
        );
        res.sendStatus(HTTPStatus.CREATED);
    } catch (error) {
        switch (error.code) {
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).json({
                    code: "DUPLICATE_ENTRY",
                    message: error.detail,
                });
                break;
            case PGErrors.FOREIGN_KEY_VIOLATION:
                res.status(HTTPStatus.NOT_FOUND).json({
                    code: "FOREIGN_KEY_NOT_FOUND",
                    message: error.detail.replace(/"/g, ""),
                });
                break;
            default:
                res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
        }
    } finally {
        client.release();
    }
}

/**
 * Create a new game; request from an admin
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  requestBodies:
 *      GameToAddFromAdmin:
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
 *                              description: Whether the user owns the game; defaults to false
 *                          review_rating:
 *                              type: integer
 *                              description: The user's rating of the game; defaults to null
 *                          review_comment:
 *                              type: string
 *                              description: The user's comment on the game; defaults to null
 *                          review_date:
 *                              type: string
 *                              format: date
 *                              description: The date of the user's review; defaults to null
 *                      required:
 *                          - user_id
 *                          - publication_id
 */
module.exports.addGameFromAdmin = async (req, res) => {
    await addGame(req.body, res);
};

/**
 * Create a new game; request from an user
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  requestBodies:
 *      GameToAddFromUser:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          publication_id:
 *                              type: integer
 *                              description: The id of the publication
 *                          is_owned:
 *                              type: boolean
 *                              description: Whether the user owns the game; defaults to false
 *                          review_rating:
 *                              type: integer
 *                              description: The user's rating of the game; defaults to null
 *                          review_comment:
 *                              type: string
 *                              description: The user's comment on the game; defaults to null
 *                          review_date:
 *                              type: string
 *                              format: date
 *                              description: The date of the user's review; defaults to null
 *                      required:
 *                          - publication_id
 */
module.exports.addGameFromUser = async (req, res) => {
    await addGame({ ...req.body, user_id: req.session.id }, res);
};

/**
 * Update a game
 *
 * @param {string|number} userId the id of the user
 * @param {string|number} publicationId the id of the publication
 * @param {Object} updateValues the values to update
 * @param {number=} updateValues.user_id if undefined, the user id won't be updated
 * @param {number=} updateValues.publication_id if undefined, the publication id won't be updated
 * @param {boolean=} updateValues.is_owned if undefined, the is_owned field won't be updated
 * @param {number=} updateValues.review_rating if undefined, the review_rating field won't be updated
 * @param {string=} updateValues.review_comment if undefined, the review_comment field won't be updated
 * @param {string|Date=} updateValues.review_date if undefined, the review_date field won't be updated
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      GameUpdated:
 *          description: The game was updated
 */
async function updateGame(userId, publicationId, updateValues, res) {
    try {
        ({ userId, publicationId } = validateObject(
            { userId, publicationId },
            gameToGetSchema
        ));
        updateValues = validateObject(updateValues, gameSchema.partial());
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            code: "INVALID_INPUT",
            message: error.message,
        });
        return;
    }

    if (Object.keys(updateValues).length === 0) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            code: "INVALID_INPUT",
            message: "No values to update",
        });
        return;
    }

    const client = await pool.connect();
    try {
        const { rowCount } = await GameModel.updateGame(
            client,
            userId,
            publicationId,
            updateValues
        );
        if (rowCount === 0) {
            res.status(HTTPStatus.NOT_FOUND).json({
                code: "RESOURCE_NOT_FOUND",
                message: "No game found",
            });
            return;
        }
        res.sendStatus(HTTPStatus.NO_CONTENT);
    } catch (error) {
        switch (error.code) {
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).json({
                    code: "DUPLICATE_ENTRY",
                    message: error.detail,
                });
                break;
            case PGErrors.FOREIGN_KEY_VIOLATION:
                res.status(HTTPStatus.NOT_FOUND).json({
                    code: "FOREIGN_KEY_NOT_FOUND",
                    message: error.detail.replace(/"/g, ""),
                });
                break;
            default:
                res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
        }
    } finally {
        client.release();
    }
}

/**
 * Update a game; request from an admin
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  requestBodies:
 *      GameToUpdateFromAdmin:
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
module.exports.updateGameFromAdmin = async (req, res) => {
    await updateGame(
        req.params.userId,
        req.params.publicationId,
        req.body,
        res
    );
};

/**
 * Update a game; request from an user
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  requestBodies:
 *      GameToUpdateFromUser:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
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
module.exports.updateGameFromUser = async (req, res) => {
    await updateGame(req.session.id, req.params.publicationId, req.body, res);
};

/**
 * Delete a game
 *
 * @param {string|number} userId the id of the user
 * @param {string|number} publicationId the id of the publication
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      GameDeleted:
 *          description: The game was deleted
 */
async function deleteGame(userId, publicationId, res) {
    try {
        ({ userId, publicationId } = validateObject(
            { userId, publicationId },
            gameToGetSchema
        ));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            code: "INVALID_INPUT",
            message: error.message,
        });
        return;
    }

    const client = await pool.connect();
    try {
        const { rowCount } = await GameModel.deleteGame(
            client,
            userId,
            publicationId
        );
        if (rowCount === 0) {
            res.status(HTTPStatus.NOT_FOUND).json({
                code: "RESOURCE_NOT_FOUND",
                message: "No game found",
            });
            return;
        }
        res.sendStatus(HTTPStatus.NO_CONTENT);
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Delete a game; request from an admin
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.deleteGameFromAdmin = async (req, res) => {
    await deleteGame(req.params.userId, req.params.publicationId, res);
};

/**
 * Delete a game; request from an user
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
module.exports.deleteGameFromUser = async (req, res) => {
    await deleteGame(req.session.id, req.params.publicationId, res);
};
