/**
 * @swagger
 * components:
 *  schemas:
 *      VideoGame:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The id of the video game
 *              name:
 *                  type: string
 *                  description: The name of the video game
 *              description:
 *                  type: string
 *                  description: The description of the video game
 */

const pool = require("../model/database");
const VideoGameModel = require("../model/videoGame");
const PublicationModel = require("../model/publication");
const GameModel = require("../model/game");
const CategoryModel = require("../model/category");
const HTTPStatus = require("../tools/HTTPStatus.js");
const { saveImageToPng, deleteImage } = require("../model/imageManager");
const destFolderVideoGame = "pictures/videoGame";

const {
    getVideoGameSchema,
    videoGameSchema,
} = require("../zod/schema/videoGame.js");
const { validateObject } = require("../zod/zod");

/**
 * Get a video game by its id or get a video game containing the name
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>} 
 *
 * @swagger
 * components:
 *  responses:
 *      VideoGameFound:
 *          description: A video game was found
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/VideoGame'
 */
module.exports.getVideoGame = async (req, res) => {
    let id, name, page, limit;
    try {
        ({ id, name, page, limit } = validateObject(
            req.query,
            getVideoGameSchema
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
        const { rows: videoGames } = await VideoGameModel.getVideoGames(
            client,
            id,
            name,
            page,
            limit
        );
        if (videoGames.length === 0) {
            res.status(HTTPStatus.NOT_FOUND).json({
                code: "RESOURCE_NOT_FOUND",
                message: "No video game found",
            });
            return;
        }
        res.json(videoGames);
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};

/**
 * Get the number of video games
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 * @swagger
 * components:
 *  responses:
 *      VideoGameCount:
 *          description: The number of video games
 *          content:
 *              application/json:
 *                  schema:
 *                      type: string
 *                      description: The number of video games
 */
module.exports.getVideoGameCount = async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows: videoGames } =
            await VideoGameModel.getVideoGameCount(client);
        res.json(videoGames[0].no);
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};

/**
 * Post a video game with a name and a description
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 *
 * @swagger
 * components:
 *  responses:
 *      VideoGameAdded:
 *          description: The video game was added
 *  requestBodies:
 *      VideoGameToAdd:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: The name of the video game
 *                          description:
 *                              type: string
 *                              description: The description of the video game
 *                          picture:
 *                              type: array
 *                              items:
 *                                 type: object
 *                      required:
 *                          - name
 *                          - description
 *                          - picture
 */
module.exports.postVideoGame = async (req, res) => {
    let name, description;
    try {
        ({ name, description } = validateObject(req.body, videoGameSchema));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            code: "INVALID_INPUT",
            message: error.message,
        });
        return;
    }
    if (!req.files.picture) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            code: "INVALID_INPUT",
            message: "No picture found",
        });
        return;
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const { rows } = await VideoGameModel.createVideoGame(
            client,
            name,
            description
        );

        await saveImageToPng(
            req.files.picture[0].buffer,
            rows[0].id,
            destFolderVideoGame
        );
        await client.query("COMMIT");
        res.sendStatus(HTTPStatus.CREATED);
    } catch (error) {
        await client.query("ROLLBACK");
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};

/**
 * Update a video game by its id
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 * 
 * 
 * @swagger
 * components:
 *  responses:
 *      VideoGameUpdated:
 *          description: The video game was updated
 *  requestBodies:
 *      VideoGameToUpdate:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: The name of the video game
 *                          description:
 *                              type: string
 *                              description: The description of the video game
 *                          picture:
 *                              type: array
 *                              items:
 *                                 type: object
 */
module.exports.updateVideoGame = async (req, res) => {
    const id = parseInt(req.params.id);
    let videoGame;
    if (isNaN(id)) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            code: "INVALID_INPUT",
            message: "Id must be a Number",
        });
        return;
    }
    try {
        videoGame = validateObject(req.body, videoGameSchema.partial());
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
        const { rowCount } = await VideoGameModel.updateVideoGame(
            client,
            id,
            videoGame
        );
        if (rowCount === 0) {
            res.status(HTTPStatus.NOT_FOUND).json({
                code: "RESOURCE_NOT_FOUND",
                message: "No video game found",
            });
            await client.query("ROLLBACK");
            return;
        }
        if (req.files.picture) {
            const picture = req.files.picture[0];
            deleteImage(id, destFolderVideoGame);
            await saveImageToPng(picture.buffer, id, destFolderVideoGame);
        }

        await client.query("COMMIT");
        res.sendStatus(HTTPStatus.NO_CONTENT);
    } catch (error) {
        await client.query("ROLLBACK");
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};

/**
 * Delete a video game by its id
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      VideoGameDeleted:
 *          description: The video game was deleted
 */
module.exports.deleteVideoGame = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            code: "INVALID_INPUT",
            message: "Id must be a Number",
        });
        return;
    }
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const { rows: publicationsIds } = await PublicationModel.getPublication(
            client,
            { videoGameId: id }
        );
        for (const publicationId of publicationsIds) {
            await GameModel.deleteGamesFromPublication(
                client,
                publicationId.id
            );
            await PublicationModel.deletePublication(client, publicationId.id);
        }
        await CategoryModel.deleteCategoriesFromVideoGame(client, id);

        const { rowCount } = await VideoGameModel.deleteVideoGame(client, id);
        if (rowCount === 0) {
            res.status(HTTPStatus.NOT_FOUND).json({
                code: "RESOURCE_NOT_FOUND",
                message: "No video game found",
            });
            await client.query("ROLLBACK");
            return;
        }
        await client.query("COMMIT");
        deleteImage(id, destFolderVideoGame);
        res.sendStatus(HTTPStatus.NO_CONTENT);
    } catch (error) {
        await client.query("ROLLBACK");
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};
