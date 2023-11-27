/**
 * @swagger
 * components:
 *  schemas:
 *      Category:
 *          type: object
 *          properties:
 *              type_id:
 *                  type: integer
 *                  description: The type id
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
 *                          type_id:
 *                              type: integer
 *                              description: The type id
 *                          video_game_id:
 *                              type: integer
 *                              description: The video game id
 *                      required:
 *                          - type_id
 *                          - video_game_id
 */
module.exports.createCategory = async (req, res) => {
    try {
        category = validateObject(category, categorySchema);
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }
    const { type_id: typeId, video_game_id: videoGameId } = category;

    const client = await pool.connect();
    try {
        await CategoryModel.createCategory(client, typeId, videoGameId);
        res.status(HTTPStatus.CREATED).send("Creation done");
    } catch (error) {
        switch (error.code) {
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).send(error.detail);
                break;
            case PGErrors.FOREIGN_KEY_VIOLATION:
                res.status(HTTPStatus.NOT_FOUND).send(error.detail);
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
 *                      oneOf:
 *                          - $ref: '#/components/schemas/Category'
 *                          - type: array
 *                            items:
 *                              $ref: '#/components/schemas/Category'
 */
module.exports.goToGet = async (req, res) => {
    const typeId = req.query.typeId;
    const videoGameId = req.query.videoGameId;

    if (typeId !== undefined && videoGameId !== undefined) {
        getCategory(typeId, videoGameId, res);
    } else if (typeId !== undefined) {
        getCategoriesFromType(typeId, res);
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
async function getAllCategories(res){
    const client = await pool.connect();
    try {
        const { rows: categories } =
            await CategoryModel.getAllCategories(client);
        if (categories.length > 0) {
            res.json(categories);
        } else {
            res.status(HTTPStatus.NOT_FOUND).send("Categories empty");
        }
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};

/**
 * Get a category
 *
 * @param {string|number} typeId The type id from the category
 * @param {string|number} videoGameId The video game id from the category
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
async function getCategory(typeId, videoGameId, res){
    try {
        ({ typeId, videoGameId } = validateObject(
            { typeId, videoGameId },
            categoryIdsSchema
        ));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }

    const client = await pool.connect();
    try {
        const category = (
            await CategoryModel.getCategory(client, typeId, videoGameId)
        ).rows[0];
        if (category !== undefined) {
            res.json(category);
        } else {
            res.status(HTTPStatus.NOT_FOUND).send(
                "Category not found for those ids"
            );
        }
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};

/**
 * Get all categories from a type
 *
 * @param {string|number} typeId The type id of the categories
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
async function getCategoriesFromType(typeId, res){
    try {
        ({ type } = validateObject({ typeId }, categoryIdsSchema.partial()));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }

    const client = await pool.connect();
    try {
        const { rows: categories } = await CategoryModel.getCategoriesFromType(
            client,
            typeId
        );
        if (categories.length > 0) {
            res.json(categories);
        } else {
            res.status(HTTPStatus.NOT_FOUND).send("Id not found");
        }
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};

/**
 * Get all categories from a video game
 *
 * @param {string} videoGameId The video game id of the categories
 * @param {Response} res
 *
 * @returns {Promise<void>}
 */
async function getCategoriesFromVideoGame(videoGameId, res){
    try {
        ({ videoGameId } = validateObject(
            { videoGameId },
            categoryIdsSchema.partial()
        ));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }

    const client = await pool.connect();
    try {
        const { rows: categories } =
            await CategoryModel.getCategoriesFromVideoGame(client, videoGameId);
        if (categories[0] !== undefined) {
            res.json(categories);
        } else {
            res.status(HTTPStatus.NOT_FOUND).send("Id not found");
        }
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
 *                          type_id:
 *                              type: integer
 *                              description: The type id
 *                          video_game_id:
 *                              type: integer
 *                              description: The video game id
 */
module.exports.updateCategory = async (req, res) => {
    try {
        ({ typeId, videoGameId } = validateObject(
            req.params,
            categoryIdsSchema
        ));
        updateValues = validateObject(req.body, categorySchema.partial());
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }

    if (Object.keys(updateValues).length === 0) {
        res.status(HTTPStatus.BAD_REQUEST).send("No values to update");
        return;
    }

    const client = await pool.connect();

    try {
        const { rowCount } = await CategoryModel.updateCategory(
            client,
            typeId,
            videoGameId,
            updateValues
        );
        if (rowCount) {
            res.sendStatus(HTTPStatus.NO_CONTENT);
        } else {
            res.status(HTTPStatus.NOT_FOUND).send("Category not found");
        }
    } catch (error) {
        switch (error.code) {
            case PGErrors.FOREIGN_KEY_VIOLATION:
                res.status(HTTPStatus.NOT_FOUND).send(error.detail);
                break;
            case PGErrors.UNIQUE_VIOLATION:
                res.status(HTTPStatus.CONFLICT).send(error.detail);
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
    try {
        ({ typeId, videoGameId } = validateObject(
            req.params,
            categoryIdsSchema
        ));
    } catch (error) {
        res.status(HTTPStatus.BAD_REQUEST).send(error.message);
        return;
    }

    const client = await pool.connect();
    try {
        const { rowCount } = await CategoryModel.deleteCategory(
            client,
            typeId,
            videoGameId
        );
        if (rowCount) {
            res.sendStatus(HTTPStatus.NO_CONTENT);
        } else {
            res.status(HTTPStatus.NOT_FOUND).send(
                "Id not found for one or more"
            );
        }
    } catch (error) {
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
};