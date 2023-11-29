/**
 * @swagger
 * components:
 *  schemas:
 *      Genre:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *                  description: The id
 *              name:
 *                  type: string
 *                  description: The genre name
 *              description:
 *                  type: string
 *                  description: The genre description
 */
const pool = require("../model/database");
const GenreModel = require("../model/genre");
const CategoryModel = require("../model/category");
const HTTPStatus = require("../tools/HTTPStatus");

const { genreSchema, genreToGetSchema } = require("../zod/schema/genre");
const PGErrors = require("../tools/PGErrors");
const { validateObject } = require("../zod/zod");

/**
 * Create a genre
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      GenreAdded:
 *          description: The genre was added
 *  requestBodies:
 *      GenreToAdd:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: The genre name
 *                          description:
 *                              type: string
 *                              description: The genre description
 *                      required:
 *                          - name
 *                          - description
 */
module.exports.createGenre = async (req, res) => {
    let name, description;
    try {
        ({ name, description } = validateObject(req.body, genreSchema));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
        return;
    }

    const client = await pool.connect();
    try {
        await GenreModel.createGenre(client, name, description);
        res.status(HTTPStatus.CREATED).send("Creation done");
    } catch (error) {
        switch (error.code) {
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).send("Genre already exists");
                break;
            default:
                res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
                break;
        }
    } finally {
        client.release();
    }
}

/**
 * Get a genre by id or all genres
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      GenreFound:
 *          description: Genre was found
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Genre'
 */
module.exports.getGenres = async (req, res) => {
    let id;
    try {
        ({ id } = validateObject(req.query, genreToGetSchema));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }
    const client = await pool.connect();
    try {
        const { rows: genres } = await GenreModel.getGenres(client, id);
        if (genres.length === 0) {
            res.status(HTTPStatus.NOT_FOUND).send("No genres found");
            return;
        }
        res.json(genres);
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Update a genre
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 * 
 * @swagger
 * components:
 *  responses:
 *      GenreUpdated:
 *          description: The genre was updated
 *  requestBodies:
 *      GenreToUpdate:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: The genre name
 *                          description:
 *                              type: string
 *                              description: The genre description

 */
module.exports.updateGenre = async (req, res) => {
    let updateValues;
    try {
        updateValues = validateObject(req.body, genreSchema.partial());
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
        return;
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        return;
    }

    const client = await pool.connect();
    try {
        const { rowCount } = await GenreModel.updateGenre(
            client,
            id,
            updateValues
        );

        if (rowCount === 0) {
            res.status(HTTPStatus.BAD_REQUEST).send("Genre not found");
            return;
        }

        res.sendStatus(HTTPStatus.NO_CONTENT);
    } catch (error) {
        switch (error.code) {
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).send(
                    "name is already in the database"
                );
                break;
            default:
                res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
                break;
        }
    } finally {
        client.release();
    }
}

/**
 * Delete a genre
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 * 
 * @swagger
 * components:
 *  responses:
 *      GenreDeleted:
 *          description: The genre was deleted
 */
module.exports.deleteGenre = async (req, res) => {
    const client = await pool.connect();
    let id;
    try {
        ({ id } = validateObject(req.params, genreToGetSchema));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }
    try {
        client.query("BEGIN");
        await CategoryModel.deleteCategoriesFromGenre(client, id);
        const { rowCount } = await GenreModel.deleteGenre(client, id);
        if (rowCount === 0) {
            res.status(HTTPStatus.BAD_REQUEST).send("Id not found");
            return;
        }
        res.sendStatus(HTTPStatus.NO_CONTENT);
        client.query("COMMIT");
    } catch (error) {
        client.query("ROLLBACK");
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}
