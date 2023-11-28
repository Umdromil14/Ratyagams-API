const pool = require("../model/database");
const PlatformModel = require("../model/platform");
const VideoGameModel = require("../model/videoGame");
const PublicationModel = require("../model/publication");
const HTTPStatus = require("../tools/HTTPStatus");
const PGErrors = require("../tools/PGErrors");
const { validateObject } = require("../zod/zod")
const { platformSchema, platformWithVideoGamesSchema } = require("../zod/schema/platform");

/**
 * @swagger
 * components:
 *  schemas:
 *     Platform:
 *         type: object
 *         properties:
 *             code:
 *                 type: string
 *                 description: The code of the platform
 *             description:
 *                 type: string
 *                 description: The description of the platform
 */

/**
 * Get all platforms or a platform by its code
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      PlatformsFound:
 *          description: Platforms were found
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Platform'
 */
module.exports.getPlatform = async (req, res) => {
    const code = req.query.code?.toUpperCase();

    const client = await pool.connect();
    try {
        const { rows: platforms } = await PlatformModel.getPlatforms(client, code);
        if (platforms.length === 0) {
            res.status(HTTPStatus.NOT_FOUND).send("No platform found");
        } else {
            res.json(platforms);
        }
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Create a new platform
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      PlatformAdded:
 *          description: The platform was added
 *  requestBodies:
 *      PlatformToAdd:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code:
 *                              type: string
 *                              description: The code of the platform (will be converted to uppercase)
 *                          description:
 *                              type: string
 *                              description: The description of the platform
 *                      required:
 *                          - code
 *                          - description
 */
module.exports.addPlatform = async (req, res) => {
    let code, description;
    try {
        ({ code, description } = validateObject(req.body, platformSchema));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }

    const client = await pool.connect();
    try {
        await PlatformModel.createPlatform(client, code, description);
        res.sendStatus(HTTPStatus.CREATED);
    } catch (error) {
        switch (error.code) {
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).send(error.detail);
                break;
            default:
                res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
        }
    } finally {
        client.release();
    }
}

/**
 * Update a platform
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 * 
 * @swagger
 * components:
 *  responses:
 *      PlatformUpdated:
 *          description: The platform was updated
 *  requestBodies:
 *      PlatformToUpdate:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code:
 *                              type: string
 *                              description: The code of the platform (will be converted to uppercase)
 *                          description:
 *                              type: string
 *                              description: The description of the platform
 */
module.exports.updatePlatform = async (req, res) => {
    let updateValues;
    try {
        updateValues = validateObject(req.body, platformSchema);
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }
    const code = req.params.code.toUpperCase();

    if (Object.keys(updateValues).length === 0) {
        res.status(HTTPStatus.BAD_REQUEST).send("No values to update");
        return;
    }

    const client = await pool.connect();
    try {
        const { rowCount } = await PlatformModel.updatePlatform(client, code, updateValues);
        if (rowCount) {
            res.sendStatus(HTTPStatus.NO_CONTENT);
        } else {
            res.status(HTTPStatus.NOT_FOUND).send("Platform not found");
        }
    } catch (error) {
        switch (error.code) {
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).send(error.detail);
                break;
            default:
                res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
        }
    } finally {
        client.release();
    }
}

/**
 * Delete a platform
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      PlatformDeleted:
 *          description: The platform was deleted
*/
module.exports.deletePlatform = async (req, res) => {
    const code = req.params.code.toUpperCase();

    const client = await pool.connect();
    try {
        const { rowCount } = await PlatformModel.deletePlatform(client, code);
        if (rowCount) {
            res.sendStatus(HTTPStatus.NO_CONTENT);
        } else {
            res.status(HTTPStatus.NOT_FOUND).send("Platform not found");
        }
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}


/**
 * Create a new platform with new video games
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 * 
 * @swagger
 * components:
 *  responses:
 *      PlatformAddedWithVideoGames:
 *          description: The platform was added with video games
 *  requestBodies:
 *      PlatformToAddWithVideoGames:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code:
 *                              type: string
 *                              description: The code of the platform (will be converted to uppercase)
 *                          description:
 *                              type: string
 *                              description: The description of the platform
 *                          video_games:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      name:
 *                                          type: string
 *                                          description: The name of the video game
 *                                      description:
 *                                          type: string
 *                                          description: The description of the video game
 *                                      release_date:
 *                                          type: string
 *                                          format: date
 *                                          description: The release date of the video game (YYYY-MM-DD)
 *                                      release_price:
 *                                          type: number
 *                                          format: float
 *                                          description: The release price of the video game
 *                                      store_page_url:
 *                                          type: string
 *                                          format: url
 *                                          description: The store page URL of the video game
 *                                  required:
 *                                      - name
 *                                      - description
 *                                      - release_date
 *                      required:
 *                          - code
 *                          - description
 *                          - video_games
 */
module.exports.addPlatformWithNewVideoGames = async (req, res) => {
    let code, description, videoGames;
    try {
        ({ code, description, video_games: videoGames } = validateObject(req.body, platformWithVideoGamesSchema));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }

    const client = await pool.connect();
    try {
        client.query("BEGIN");
        await PlatformModel.createPlatform(client, code, description);

        for (const videoGame of videoGames) {
            const videoGameId = (await VideoGameModel.createVideoGame(client, videoGame.name, videoGame.description)).rows[0].id;

            await PublicationModel.createPublication(
                client,
                code,
                videoGameId,
                videoGame.release_date,
                videoGame.release_price,
                videoGame.store_page_url
            );
        }

        client.query("COMMIT");
        res.sendStatus(HTTPStatus.CREATED);
    } catch (error) {
        client.query("ROLLBACK");

        switch (error.code) {
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).send(error.detail);
                break;
            default:
                res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
        }
    } finally {
        client.release();
    }
}