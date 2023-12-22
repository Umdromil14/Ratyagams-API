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
const { saveImageToPng, deleteImage } = require("../model/imageManager");
const destFolderGenre = "pictures/genre";

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
 *                          picture:
 *                              type: object
 *                              description: The picture of the video game
 *                      required:
 *                          - name
 *                          - description
 *                          - picture
 */
module.exports.createGenre = async (req, res) => {
    let name, description;
    try {
        ({ name, description } = validateObject(req.body, genreSchema));
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
            message: "No picture",
        });
        return;
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const { rows } = await GenreModel.createGenre(
            client,
            name,
            description
        );
        await saveImageToPng(req.files.picture[0].buffer, rows[0].id, destFolderGenre);
        await client.query("COMMIT");
        res.sendStatus(HTTPStatus.CREATED);
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        switch (error.code) {
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
 * Get one or more genre depending on the query parameterss
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
module.exports.getGenre = async (req, res) => {
    let id, alphabetical, page, limit;
    try {
        ({ id, alphabetical, page, limit } = validateObject(
            req.query,
            genreToGetSchema
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
        const { rows: genres } = await GenreModel.getGenres(
            client,
            id,
            alphabetical,
            page,
            limit
        );
        if (genres.length === 0) {
            res.status(HTTPStatus.NOT_FOUND).json({
                code: "RESOURCE_NOT_FOUND",
                message: "No genres found",
            });
            return;
        }
        res.json(genres);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};

/**
 * Get number of genres
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      GenresCount:
 *          description: The number of genres
 *          content:
 *              application/json:
 *                  schema:
 *                      type: integer
 *                      description: The number of genres
 */
module.exports.getGenresCount = async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows: genres } = await GenreModel.getGenresCount(client);
        res.json(genres[0].no);
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};

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
    let updateValues, id;
    try {
        ({ id } = validateObject(req.params, genreToGetSchema));
        updateValues = validateObject(req.body, genreSchema.partial());
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
        await client.query("BEGIN");
        const { rowCount } = await GenreModel.updateGenre(
            client,
            id,
            updateValues
        );

        if (rowCount === 0) {
            res.status(HTTPStatus.BAD_REQUEST).json({
                code: "RESOURCE_NOT_FOUND",
                message: "No genre found",
            });
            await client.query("ROLLBACK");
            return;
        }
        if (req.files.picture) {
            const picture = req.files.picture[0];
            deleteImage(id, destFolderGenre);
            await saveImageToPng(picture.buffer, id, destFolderGenre);
        }

        await client.query("COMMIT");
        res.sendStatus(HTTPStatus.NO_CONTENT);
    } catch (error) {
        await client.query("ROLLBACK");
        switch (error.code) {
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).json({
                    code: "DUPLICATE_ENTRY",
                    message: error.detail,
                });
                break;
            default:
                console.error(error);
                res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
        }
    } finally {
        client.release();
    }
};

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
        res.status(HTTPStatus.BAD_REQUEST).json({
            code: "INVALID_INPUT",
            message: error.message,
        });
        return;
    }
    try {
        await client.query("BEGIN");
        await CategoryModel.deleteCategoriesFromGenre(client, id);
        const { rowCount } = await GenreModel.deleteGenre(client, id);
        if (rowCount === 0) {
            res.status(HTTPStatus.NOT_FOUND).json({
                code: "RESOURCE_NOT_FOUND",
                message: "No genre found",
            });
            await client.query("ROLLBACK");
            return;
        }
        
        await client.query("COMMIT");
        deleteImage(id, destFolderGenre);
        res.sendStatus(HTTPStatus.NO_CONTENT);
    } catch (error) {
        await client.query("ROLLBACK");
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};
