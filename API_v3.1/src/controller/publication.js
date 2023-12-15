/**
 * @swagger
 * components:
 *  schemas:
 *      Publication:
 *          type: object
 *          properties:
 *              platform_code:
 *                  type: string
 *                  description: The platform code
 *              video_game_id:
 *                  type: integer
 *                  description: The video game id
 *              release_date:
 *                  type: string
 *                  format: date
 *                  description: The release date (YYYY-MM-DD or MM-DD-YYYY)
 *              release_price:
 *                  type: number
 *                  description: The game price when it's released
 *              store_page_url:
 *                  type: string
 *                  description: The url of the official store page where the game is available to buy
 */

const pool = require("../model/database");
const PublicationModel = require("../model/publication");
const gameModel = require("../model/game");
const HTTPStatus = require("../tools/HTTPStatus");
const { validateObject } = require("../zod/zod");
const {
    publicationToGetSchema,
    publicationIdSchema,
    publicationSchema,
} = require("../zod/schema/publication");
const PGErrors = require("../tools/PGErrors");

/**
 * Create a publication
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      PublicationAdded:
 *          description: The publication was added
 *  requestBodies:
 *      PublicationToAdd:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          platform_code:
 *                              type: string
 *                              description: The platform code
 *                          video_game_id:
 *                              type: integer
 *                              description: The video game id
 *                          release_date:
 *                              type: string
 *                              format: date
 *                              description: The release date (YYYY-MM-DD or MM-DD-YYYY)
 *                          release_price:
 *                              type: number
 *                              description: The game price when it's released
 *                          store_page_url:
 *                              type: string
 *                              description: The url of the official store page where the game is available to buy
 *                      required:
 *                          - platform_code
 *                          - video_game_id
 *                          - release_date
 */
module.exports.createPublication = async (req, res) => {
    let publication;
    try {
        publication = validateObject(req.body, publicationSchema);
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            code: "INVALID_INPUT",
            message: error.message,
        });
        return;
    }

    const client = await pool.connect();
    const {
        platform_code: platformCode,
        video_game_id: videoGameId,
        release_price: releasePrice,
        release_date: releaseDate,
        store_page_url: storePageURL,
    } = publication;

    try {
        await PublicationModel.createPublication(
            client,
            platformCode,
            videoGameId,
            releaseDate,
            releasePrice,
            storePageURL
        );
        res.sendStatus(HTTPStatus.CREATED);
    } catch (error) {
        switch (error.code) {
            case PGErrors.FOREIGN_KEY_VIOLATION:
                res.status(HTTPStatus.NOT_FOUND).json({
                    code: "FOREIGN_KEY_NOT_FOUND",
                    message: error.detail.replace(/"/g, ""),
                });
                break;
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).json({
                    code: "DUPLICATE_ENTRY",
                    message: error.detail,
                });
                break;
            default:
                res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
        }
    } finally {
        client.release();
    }
};

/**
 * Get one or more publications
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      PublicationFound:
 *          description: Publication was found
 *          content:
 *              application/json:
 *                  schema:
 *                      oneOf:
 *                          - type: array
 *                            items:
 *                                $ref: '#/components/schemas/Publication'
 *                          - type: array
 *                            items:
 *                                type: object
 *                                properties:
 *                                    id:
 *                                        type: integer
 *                                        description: The publication id
 *                                    platform_code:
 *                                        type: string
 *                                        description: The platform code
 *                                    video_game_id:
 *                                        type: integer
 *                                        description: The video game id
 *                                    release_date:
 *                                        type: string
 *                                        format: date
 *                                        description: The release date (YYYY-MM-DD or MM-DD-YYYY)
 *                                    release_price:
 *                                        type: number
 *                                        description: The game price when it's released             
 *                                    store_page_url:
 *                                        type: string
 *                                        description: The url of the official store page where the game is available to buy
 *                                    name:
 *                                        type: string
 *                                        description: The video game name
 *                                    description:
 *                                        type: string
 *                                        description: The video game description
 */
module.exports.getPublication = async (req, res) => {
    let options;
    try {
        options = validateObject(req.query, publicationToGetSchema);
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            code: "INVALID_INPUT",
            message: error.message,
        });
        return;
    }

    options.userId = options.getOwnGames ? req.session.id : undefined;

    const client = await pool.connect();
    try {
        const { rows: publications } = await PublicationModel.getPublication(
            client,
            options
        );
        if (publications.length === 0) {
            res.status(HTTPStatus.NOT_FOUND).json({
                code: "RESOURCE_NOT_FOUND",
                message: "No publications found",
            });
            return;
        }
        res.json(publications);
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};

/**
 * Get the number of publications
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      PublicationCount:
 *          description: The number of publications
 *          content:
 *              application/json:
 *                  schema:
 *                      type: integer
 *                      properties:
 *                          no:
 *                              type: integer
 *                              description: The number of publications
 */
module.exports.getPublicationCount = async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows: publications } =
            await PublicationModel.getPublicationCount(client);
        res.json(publications[0].no);
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};

/**
 * Update a publications
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      PublicationUpdated:
 *          description: The publication was updated
 *  requestBodies:
 *      PublicationToUpdate:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          platform_code:
 *                              type: string
 *                              description: The platform code
 *                          video_game_id:
 *                              type: integer
 *                              description: The video game id
 *                          release_date:
 *                              type: string
 *                              format: date
 *                              description: The release date (YYYY-MM-DD)
 *                          release_price:
 *                              type: number
 *                              description: The game price when it's released
 *                          store_page_url:
 *                              type: string
 *                              description: The url of the official store page where the game is available to buy
 */
module.exports.updatePublication = async (req, res) => {
    let publicationId, updateValues;
    try {
        ({ publicationId } = validateObject(req.params, publicationIdSchema));
        updateValues = validateObject(req.body, publicationSchema.partial());
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
        const { rowCount } = await PublicationModel.updatePublication(
            client,
            publicationId,
            updateValues
        );
        if (rowCount === 0) {
            res.status(HTTPStatus.NOT_FOUND).json({
                code: "RESOURCE_NOT_FOUND",
                message: "No publication found",
            });
            return;
        }
        res.sendStatus(HTTPStatus.NO_CONTENT);
    } catch (error) {
        switch (error.code) {
            case PGErrors.FOREIGN_KEY_VIOLATION:
                res.status(HTTPStatus.NOT_FOUND).json({
                    code: "FOREIGN_KEY_NOT_FOUND",
                    message: error.detail.replace(/"/g, ""),
                });
                break;
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).json({
                    code: "DUPLICATE_ENTRY",
                    message: error.detail,
                });
                break;
            default:
                res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
        }
    } finally {
        client.release();
    }
};

/**
 * Delete a publication
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      PublicationDeleted:
 *          description: The publication was deleted
 */
module.exports.deletePublication = async (req, res) => {
    let publicationId;
    try {
        ({ publicationId } = validateObject(req.params, publicationIdSchema));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            code: "INVALID_INPUT",
            message: error.message,
        });
        return;
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await gameModel.deleteGamesFromPublication(client, publicationId);
        const { rowCount } = await PublicationModel.deletePublication(
            client,
            publicationId
        );
        if (rowCount === 0) {
            res.status(HTTPStatus.NOT_FOUND).json({
                code: "RESOURCE_NOT_FOUND",
                message: "No publication found",
            });
            await client.query("ROLLBACK");
            return;
        }
        res.sendStatus(HTTPStatus.NO_CONTENT);
        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};
