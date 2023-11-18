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
 * @swagger
 * components:
 *  responses:
 *      PlatformFound:
 *          description: A platform was found
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Platform'
*/

/**
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

/**
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

/**
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

/**
 * @swagger
 * components:
 *  responses:
 *      PlatformDeleted:
 *          description: The platform was deleted
*/

/**
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

const pool = require("../model/database");
const PlatformModel = require("../model/platform");
const VideoGameModel = require("../model/videoGame");
const PublicationModel = require("../model/publication");
const HTTPStatus = require("../tools/HTTPStatus");
const PGErrors = require("../tools/PGErrors");

const { platformSchema, platformToUpdateSchema, platformWithVideoGamesSchema } = require("../schema/platform");

/**
 * Get a platform by its code
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getPlatform = async (req, res) => {
    const code = req.params.code.toUpperCase();

    const client = await pool.connect();
    try {
        const { rows: platforms } = await PlatformModel.getPlatform(client, code);
        if (platforms.length === 0) {
            res.status(HTTPStatus.NOT_FOUND).send("No platform found");
        } else {
            res.json(platforms[0]);
        }
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Get all platforms
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getAllPlatforms = async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows: platforms } = await PlatformModel.getAllPlatforms(client);
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
 */
module.exports.postPlatform = async (req, res) => {
    const result = platformSchema.safeParse(req.body);
    if (!result.success) {
        res.status(HTTPStatus.BAD_REQUEST).send(
            result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(" & ")
        );
        return;
    }
    const { code, description } = result.data;

    const client = await pool.connect();
    try {
        await PlatformModel.createPlatform(client, code, description);
        res.sendStatus(HTTPStatus.CREATED);
    } catch (error) {
        switch (error.code) {
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).send("Platform already exists");
                break;
            default:
                console.log(error);
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
 */
module.exports.updatePlatform = async (req, res) => {
    const result = platformToUpdateSchema.safeParse(req.body);
    if (!result.success) {
        res.status(HTTPStatus.BAD_REQUEST).send(
            result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(" & ")
        );
        return;
    }
    const code = req.params.code.toUpperCase();
    const updateValues = result.data;

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
                res.status(HTTPStatus.CONFLICT).send("Platform already exists with new code");
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
 */
module.exports.postPlatformWithNewVideoGames = async (req, res) => {
    const result = platformWithVideoGamesSchema.safeParse(req.body);
    if (!result.success) {
        res.status(HTTPStatus.BAD_REQUEST).send(
            result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(" & ")
        );
        return;
    }
    const { code, description, video_games: videoGames } = result.data;

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
                new Date(videoGame.release_date),
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
                res.status(HTTPStatus.CONFLICT).send("Platform already exists");
                break;
            default:
                res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
        }
    } finally {
        client.release();
    }
}