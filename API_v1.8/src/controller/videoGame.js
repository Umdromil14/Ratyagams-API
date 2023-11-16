/**
 *@swagger
 *components:
 *  schemas:
 *      VideoGame:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              name:
 *                  type: string
 *              description:
 *                  type: string
 * 
 *  requestBodies:
 *      CreateVideoGame:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                          description:
 *                              type: string
 *      UpdateVideoGame:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                          description:
 *                              type: string
 *  responses:
 *      VideoGameFound:
 *          description: Video was found
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/VideoGame'
 *      VideoGamesFound:
 *          description: Video games were found
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/VideoGame'

 */
const pool = require("../model/database");
const VideoGameModel = require("../model/videoGame");
const PublicationModel = require("../model/publication");
const GameController = require("../model/game");
const CategoryModel = require("../model/category");
const HTTPStatus = require("../tools/HTTPStatus.js");
const tools = require("../tools/utils.js");

/**
 * Get all video games
 * 
 * @param {Request} req 
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getVideoGames = async (req, res) => {
	const client = await pool.connect();
	try {
		const { rows: videoGames } = await VideoGameModel.getVideoGames(client);
		if (videoGames.length === 0) {
			res.status(HTTPStatus.NOT_FOUND).send("No video game found");
			return;
		}
		res.status(HTTPStatus.ACCEPTED).json(videoGames);
	} catch (error) {
		res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send("Internal Server Error");
	} finally {
		client.release();
	}
}

/**
 * Get a video game by its id
 * 
 * @param {Request} req from the url
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getVideoGame = async (req, res) => {
	const id = parseInt(req.params.id);
	
	if (isNaN(id)) {
		res.status(HTTPStatus.BAD_REQUEST).send("Id must be a Number");
		return;
	}

	const client = await pool.connect();
	try {
		const videoGame = (await VideoGameModel.getVideoGame(client, id)).rows[0];
		if (!videoGame) {
			res.status(HTTPStatus.NOT_FOUND).send("No video game found");
		} else {
			res.json(videoGame);
		}
	} catch (error) {
		res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send("Internal Server Error");
	} finally {
		client.release();
	}
}
/**
 * post a video game with a name and a description
 * 
 * @param {Request} req from the body, need to be fill with a name and a description
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.postVideoGame = async (req, res) => {
	const model = {
		name : ["string"],
		description : ["string"]
	};
	if (!tools.isValidObject(req.body, model)) {
		res.status(HTTPStatus.BAD_REQUEST).send("Missing parameters");
		return;
	}
	const { name, description } = req.body;
	
	const client = await pool.connect();
	try {
		await VideoGameModel.createVideoGame(client, name, description);
		res.status(HTTPStatus.CREATED).send("Video Game created");
	} catch (error) {
		res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send("Internal Server Error");
	} finally {
		client.release();
	}
}
/**
 * Update a video game by its id
 * 
 * @param {Request} req from the url and the body, need to be fill with a name or a description
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.updateVideoGame = async (req, res) => {
	const id = parseInt(req.params.id);
	const model = {
		name : ["string","optional"],
		description : ["string","optional"]
	};
	if (!tools.isValidObject(req.body, model,true) || isNaN(id)) {
		res.status(HTTPStatus.BAD_REQUEST).send("Missing parameters");
		return;
	}

	const client = await pool.connect();
	try {
		const { rowCount } = await VideoGameModel.updateVideoGame(client, id, req.body);
		if (rowCount === 0) {
			res.status(HTTPStatus.NOT_FOUND).send("No video game found");
			return;
		}
		res.status(HTTPStatus.CREATED).send("Video Game updated");
	} catch (error) {
		res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send("Internal Server Error");
	} finally {
		client.release();
	}
}

/**
 * Delete a video game by its id
 * 
 * @param {Request} req Id from the url
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.deleteVideoGame = async (req, res) => {
	const id = parseInt(req.params.id);
	if (isNaN(id)) {
		res.status(HTTPStatus.BAD_REQUEST).send("Id must be a Number");
		return;
	}
	const client = await pool.connect();
	try {
		client.query("BEGIN");
		const publicationIds = (await PublicationModel.getPublicationsFromVideoGame(client, id)).rows;
		if (publicationIds.length !== 0) {
			for (const publicationId of publicationIds) {
				await GameController.deleteGamesFromPublication(client, publicationId.id);
				await PublicationModel.deletePublication(client, publicationId.id);
			}
		}
		await CategoryModel.deleteCategoriesFromVideoGame(client, id);
		await VideoGameModel.deleteVideoGame(client, id); 
		client.query("COMMIT");
		res.status(HTTPStatus.NO_CONTENT).send("Video Game deleted");
	} catch (error) {
		client.query("ROLLBACK");
		res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send("Internal Server Error");
	} finally {
		client.release();
	}
}