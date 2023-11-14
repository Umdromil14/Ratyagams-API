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
 *                              description: The code of the platform
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
 *                              description: The code of the platform
 *                          description:
 *                              type: string
 *                              description: The description of the platform
*/

/**
 * @swagger
 * components:
 *  responses:
 *      PlatformDeleted:
 *          description: A platform was deleted
*/

const pool = require("../model/database");
const PlatformModel = require("../model/platform");
const VideoGameModel = require("../model/videoGame");
const PublicationModel = require("../model/publication");
const { isValidObject, isValidDate } = require("../tools/utils");
const HTTPStatus = require("../tools/HTTPStatus");

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
        const { rows: platform } = await PlatformModel.getPlatform(client, code);
        if (platform.length === 0) {
            res.status(HTTPStatus.NOT_FOUND).send("No platform found");
        } else {
            res.json(platform[0]);
        }
    } catch (error) {
        console.log(error);
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
        console.log(error);
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
    const model = {
        code: ["string"],
        description: ["string"]
    }

    const body = req.body;
    if (!isValidObject(body, model)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
        return;
    }

    const code = body.code.toUpperCase();
    const { description } = body;
    const client = await pool.connect();

    try {
        if (await PlatformModel.platformExists(client, code)) {
            res.status(HTTPStatus.CONFLICT).send("Platform already exists")
        } else {
            await PlatformModel.createPlatform(client, code, description);
            res.sendStatus(HTTPStatus.CREATED);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
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
    const model = {
        code: ["string", "optional"],
        description: ["string", "optional"]
    }

    const code = req.params.code.toUpperCase();
    const body = req.body;
    if (!isValidObject(body, model, true)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
        return;
    }

    const newCode = body.code ? body.code.toUpperCase() : undefined;
    const updateValues = {
        code: newCode,
        description: body.description
    };

    const client = await pool.connect();
    try {
        if (newCode && code !== newCode && await PlatformModel.platformExists(client, newCode)) {
            res.status(HTTPStatus.CONFLICT).send("Platform already exists");
            return;
        }

        const { rowCount } = await PlatformModel.updatePlatform(client, code, updateValues);
        if (rowCount) {
            res.sendStatus(HTTPStatus.NO_CONTENT);
        } else {
            res.status(HTTPStatus.NOT_FOUND).send("Platform not found");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
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
        console.log(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

module.exports.postPlatformWithNewVideoGames = async (req, res) => {
    const model = {
        code: ["string"],
        description: ["string"],
        video_games: ["object"]
    }

    const videoGameModel = {
        name: ["string"],
        description: ["string"],
        release_date: ["string"],
        release_price: ["number", "optional"],
        store_page_url: ["string", "optional"]
    }

    const body = req.body;
    if (!isValidObject(body, model) || !Array.isArray(body.video_games)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
        return;
    }

    const code = body.code.toUpperCase();
    const { description } = body;
    const videoGames = body.video_games.filter(
        videoGame => isValidObject(videoGame, videoGameModel) && isValidDate(videoGame.release_date)
    );
    const client = await pool.connect();

    try {
        if (await PlatformModel.platformExists(client, code)) {
            res.status(HTTPStatus.CONFLICT).send("Platform already exists")
            return;
        }

        client.query("BEGIN");

        await PlatformModel.createPlatform(client, code, description);

        for (const videoGame of videoGames) {
            const { rows } = await VideoGameModel.createVideoGame(client, videoGame.name, videoGame.description);
            const videoGameId = rows[0].id;

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
        res.status(HTTPStatus.CREATED).send(`Platform created with ${videoGames.length} video game(s)`);
    } catch (error) {
        client.query("ROLLBACK");
        console.log(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}