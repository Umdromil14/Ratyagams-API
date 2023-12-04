/**
 * @swagger
 * components:
 *  schemas:
 *      Category:
 *          type: object
 *          properties:
 *              genre_id:
 *                  type: integer
 *                  description: The genre id
 *              video_game_id:
 *                  type: integer
 *                  description: The video game id
 */

const pool = require("../model/database");
const CategoryModel = require("../model/category");
const HTTPStatus = require("../tools/HTTPStatus");
const PGErrors = require("../tools/PGErrors");
const { validateObject } = require("../zod/zod");
const { categoryIdsSchema, categorySchema } = require("../zod/schema/category");

/**
 * Create a category
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      CategoryAdded:
 *          description: The category was added
 *  requestBodies:
 *      CategoryToAdd:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          genre_id:
 *                              type: integer
 *                              description: The genre id
 *                          video_game_id:
 *                              type: integer
 *                              description: The video game id
 *                      required:
 *                          - genre_id
 *                          - video_game_id
 */
module.exports.createCategory = async (req, res) => {
    let category;
    try {
        category = validateObject(req.body, categorySchema);
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            message: error.message,
        });
        return;
    }
    const { genre_id: genreId, video_game_id: videoGameId } = category;

    const client = await pool.connect();
    try {
        await CategoryModel.createCategory(client, genreId, videoGameId);
        res.sendStatus(HTTPStatus.CREATED);
    } catch (error) {
        switch (error.code) {
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).json({
                    message: error.detail,
                });
                break;
            case PGErrors.FOREIGN_KEY_VIOLATION:
                res.status(HTTPStatus.NOT_FOUND).json({
                    message: error.detail.replace(/"/g, ""),
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
 * Redirect the program to the correct get function
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      CategoryFound:
 *          description: Category(ies) was(were) found
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Category'
 */
module.exports.goToGet = async (req, res) => {
    const genreId = req.query.genreId;
    const videoGameId = req.query.videoGameId;

    if (genreId !== undefined && videoGameId !== undefined) {
        getCategory(genreId, videoGameId, res);
    } else if (genreId !== undefined) {
        getCategoriesFromGenre(genreId, res);
    } else if (videoGameId !== undefined) {
        getCategoriesFromVideoGame(videoGameId, res);
    } else {
        getAllCategories(res);
    }
};

/**
 * Get all the categories
 *
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
async function getAllCategories(res) {
    const client = await pool.connect();
    try {
        const { rows: categories } = await CategoryModel.getAllCategories(
            client
        );
        if (categories.length > 0) {
            res.json(categories);
        } else {
            res.status(HTTPStatus.NOT_FOUND).json({
                message: "No category found",
            });
        }
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Get a category
 *
 * @param {string|number} genreId The genre id from the category
 * @param {string|number} videoGameId The video game id from the category
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
async function getCategory(genreId, videoGameId, res) {
    try {
        ({ genreId, videoGameId } = validateObject(
            { genreId, videoGameId },
            categoryIdsSchema
        ));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            message: error.message,
        });
        return;
    }

    const client = await pool.connect();
    try {
        const category = (
            await CategoryModel.getCategory(client, genreId, videoGameId)
        ).rows;
        if (category !== undefined) {
            res.json(category);
        } else {
            res.status(HTTPStatus.NOT_FOUND).json({
                message: "No category found",
            });
        }
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Get all categories from a genre
 *
 * @param {string|number} genreId The genre id of the categories
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
async function getCategoriesFromGenre(genreId, res) {
    try {
        ({ genreId } = validateObject(
            { genreId },
            categoryIdsSchema.partial()
        ));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            message: error.message,
        });
        return;
    }

    const client = await pool.connect();
    try {
        const { rows: categories } = await CategoryModel.getCategoriesFromGenre(
            client,
            genreId
        );
        if (categories.length > 0) {
            res.json(categories);
        } else {
            res.status(HTTPStatus.NOT_FOUND).json({
                message: "No category found",
            });
        }
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Get all categories from a video game
 *
 * @param {string} videoGameId The video game id of the categories
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
async function getCategoriesFromVideoGame(videoGameId, res) {
    try {
        ({ videoGameId } = validateObject(
            { videoGameId },
            categoryIdsSchema.partial()
        ));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            message: error.message,
        });
        return;
    }

    const client = await pool.connect();
    try {
        const { rows: categories } =
            await CategoryModel.getCategoriesFromVideoGame(client, videoGameId);
        if (categories[0] !== undefined) {
            res.json(categories);
        } else {
            res.status(HTTPStatus.NOT_FOUND).json({
                message: "No category found",
            });
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Update a category
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      CategoryUpdated:
 *          description: The category was updated
 *  requestBodies:
 *      CategoryToUpdate:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          genre_id:
 *                              type: integer
 *                              description: The genre id
 *                          video_game_id:
 *                              type: integer
 *                              description: The video game id
 */
module.exports.updateCategory = async (req, res) => {
    let genreId, videoGameId, updateValues;
    try {
        ({ genreId, videoGameId } = validateObject(
            req.params,
            categoryIdsSchema
        ));
        updateValues = validateObject(req.body, categorySchema.partial());
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            message: error.message,
        });
        return;
    }

    if (Object.keys(updateValues).length === 0) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            message: "No value to update",
        });
        return;
    }

    const client = await pool.connect();

    try {
        const { rowCount } = await CategoryModel.updateCategory(
            client,
            genreId,
            videoGameId,
            updateValues
        );
        if (rowCount) {
            res.sendStatus(HTTPStatus.NO_CONTENT);
        } else {
            res.status(HTTPStatus.NOT_FOUND).json({
                message: "No category found",
            });
        }
    } catch (error) {
        switch (error.code) {
            case PGErrors.FOREIGN_KEY_VIOLATION:
                res.status(HTTPStatus.NOT_FOUND).json({
                    message: error.detail.replace(/"/g, ""),
                });
                break;
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).json({
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
 * Delete a category
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      CategoryDeleted:
 *          description: The category was deleted
 */
module.exports.deleteCategory = async (req, res) => {
    let genreId, videoGameId;
    try {
        ({ genreId, videoGameId } = validateObject(
            req.params,
            categoryIdsSchema
        ));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            message: error.message,
        });
        return;
    }

    const client = await pool.connect();
    try {
        const { rowCount } = await CategoryModel.deleteCategory(
            client,
            genreId,
            videoGameId
        );
        if (rowCount) {
            res.sendStatus(HTTPStatus.NO_CONTENT);
        } else {
            res.status(HTTPStatus.NOT_FOUND).json({
                message: "No category found",
            });
        }
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};
