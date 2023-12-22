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
const {
    categoryIdsSchema,
    categorySchema,
    getCategorySchema,
} = require("../zod/schema/category");

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
            code: "INVALID_INPUT",
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
};

/**
 * Get one or more categories based on the query parameters
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
module.exports.getCategory = async (req, res) => {
    let genreId, videoGameId, page, limit;
    try {
        ({ genreId, videoGameId, page, limit } = validateObject(
            req.query,
            getCategorySchema
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
        const { rows: categories } = await CategoryModel.getCategories(
            client,
            genreId,
            videoGameId,
            page,
            limit
        );
        if (categories.length === 0) {
            res.status(HTTPStatus.NOT_FOUND).json({
                code: "RESOURCE_NOT_FOUND",
                message: "No category found",
            });
            return;
        }
        res.json(categories);
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};

/**
 * Get the number of categories
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {Promise<void>}
 *
 * @swagger
 * components:
 *  responses:
 *      CategoryCount:
 *          description: The number of categories
 *          content:
 *              application/json:
 *                  schema:
 *                      type: string
 *                      description: The number of categories
 */
module.exports.getCategoriesCount = async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows: categories } =
            await CategoryModel.getCategoriesCount(client);
        res.json(categories[0].no);
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};

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
            code: "INVALID_INPUT",
            message: error.message,
        });
        return;
    }

    if (Object.keys(updateValues).length === 0) {
        res.status(HTTPStatus.BAD_REQUEST).json({
            code: "INVALID_INPUT",
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
        if (rowCount === 0) {
            res.status(HTTPStatus.NOT_FOUND).json({
                code: "RESOURCE_NOT_FOUND",
                message: "No category found",
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
            code: "INVALID_INPUT",
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
        if (rowCount === 0) {
            res.status(HTTPStatus.NOT_FOUND).json({
                code: "RESOURCE_NOT_FOUND",
                message: "No category found",
            });
            return;
        }
        res.sendStatus(HTTPStatus.NO_CONTENT);
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};