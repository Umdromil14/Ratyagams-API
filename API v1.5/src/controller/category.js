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

/**
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

/**
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

// /**
//  * @swagger
//  * components:
//  *  responses:
//  *      CategoriesFound:
//  *          description: Categories were found
//  *          content:
//  *              application/json:
//  *                  schema:
//  *                      type: array
//  *                      items:
//  *                          $ref: '#/components/schemas/Category'
//  */

// /**
//  * @swagger
//  * components:
//  *  responses:
//  *      CategoryFound:
//  *          description: A category was found
//  *          content:
//  *              application/json:
//  *                  schema:
//  *                      $ref: '#/components/schemas/Category'
//  */

/**
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

/**
 * @swagger
 * components:
 *  responses:
 *      CategoryDeleted:
 *          description: The category was deleted
 */
const pool = require("../model/database");
const CategoryModel = require("../model/category");
const TypeModel = require("../model/type");
const VideoGameModel = require("../model/videoGame");
const utils = require("../tools/utils");
const HTTPStatus = require("../tools/HTTPStatus");

/**
 * Check if the ids are valid; if not, return the corresponding HTTP status code
 * 
 * @param {pg.Pool} client the postgres client
 * @param {number} typeId the type id
 * @param {number} videoGameId the video game id
 * 
 * @returns {Object} the response (keys: HTTPStatus (404, 409), message (string)); if the ids are valid, the status is undefined
 */
async function validateIds(client, typeId, videoGameId) {
    const [typeExists, videoGameExists, categoryExists] = await Promise.all([
        TypeModel.typeExistsId(client, typeId),
        VideoGameModel.videoGameExists(client, videoGameId),
        CategoryModel.categoryExists(client, typeId, videoGameId)
    ]);

    if (!typeExists) {
        return {
            status: HTTPStatus.NOT_FOUND,
            message: "Type not found"
        };
    } else if (!videoGameExists) {
        return {
            status: HTTPStatus.NOT_FOUND,
            message: "Video game not found"
        };
    } else if (categoryExists) {
        return {
            status: HTTPStatus.CONFLICT,
            message: "Category already exists"
        };
    }
}

/**
 * Create a category
 * 
 * @param {Request} req The type id and the video game id inside of the body
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.createCategory = async (req, res) => {
    const model = {
        type_id: ["number"],
        video_game_id: ["number"]
    }
    const body = req.body;
    if (!utils.isValidObject(body, model)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
        return;
    }

    const client = await pool.connect();
    const {
        type_id: typeId,
        video_game_id: videoGameId } = body;
    try {
        const promiseType = TypeModel.typeExistsId(client, typeId);
        const promiseVideoGame = VideoGameModel.videoGameExistsById(client, videoGameId);
        const promiseCategory = CategoryModel.categoryExists(client, videoGameId, typeId);
        const [typeExists, videoGameExists, categoryExists] = await Promise.all(promiseType, promiseVideoGame, promiseCategory);
        if (typeExists && videoGameExists && !categoryExists) {
            await CategoryModel.createCategory(client, typeId, videoGameId);
            res.status(HTTPStatus.CREATED).send("Creation done");
        }
        else if(categoryExists){
            res.status(HTTPStatus.CONFLICT).send("Category already exists");
        }
        else {
            res.status(HTTPStatus.NOT_FOUND).send(errorMessage(client, typeExists, videoGameExists));
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Redirect the program to the correct get function
 * 
 * @param {Request} req The type id and/or the video game id inside the params as query
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.goToGet = async (req, res) => {
    const typeIdTexte = req.query.typeId;
    const videoGameIdTexte = req.query.videoGameId;

    if(typeIdTexte !== undefined && videoGameIdTexte !== undefined){
        this.getCategory(typeIdTexte, videoGameIdTexte, res);
    }
    else if(typeIdTexte !== undefined){
        this.getCategoriesFromType(typeIdTexte, res);
    }
    else if(videoGameIdTexte !== undefined){
        this.getCategoriesFromVideoGame(videoGameIdTexte, res);
    }
    else{
        this.getAllCategories(res);
    }
}

/**
 * Get all the categories
 * 
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getAllCategories = async (res) => {
    const client = await pool.connect();
    try {
        const { rows: categories } = await CategoryModel.getAllCategories(client);
        if (categories !== undefined) {
            res.json(categories);
        }
        else {
            res.status(HTTPStatus.NOT_FOUND).send("Categories empty");
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release()
    }
}

/**
 * Get a category
 * 
 * @param {string} typeIdTexte The type id from the category
 * @param {string} videoGameIdTexte The video game id from the category
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getCategory = async (typeIdTexte, videoGameIdTexte, res) => {
    const client = await pool.connect();
    const typeId = parseInt(typeIdTexte);
    const videoGameId = parseInt(videoGameIdTexte);
    try {
        if (isNaN(typeId) || isNaN(videoGameId)) {
            res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        }
        else {
            const { rows: categories } = await CategoryModel.getCategory(client, typeId, videoGameId);
            const category = categories[0];
            if (category !== undefined) {
                res.json(category);
            }
            else {
                res.status(HTTPStatus.NOT_FOUND).send("Id not found for one or more");
            }
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Get all categories from a type
 * 
 * @param {string} typeIdTexte The type id of the categories
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getCategoriesFromType = async (typeIdTexte, res) => {
    const client = await pool.connect();
    const typeId = parseInt(typeIdTexte);
    try {
        if (isNaN(typeId)) {
            res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        }
        else {
            const { rows: categories } = await CategoryModel.getCategoriesFromType(client, typeId);
            if (categories !== undefined) {
                res.json(categories);
            }
            else {
                res.status(HTTPStatus.NOT_FOUND).send("Id not found");
            }
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Get all categories from a video game
 * 
 * @param {string} videoGameIdTexte The video game id of the categories
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getCategoriesFromVideoGame = async (videoGameIdTexte, res) => {
    const videoGameId = parseInt(videoGameIdTexte);
    const client = await pool.connect();
    try {
        if (isNaN(videoGameId)) {
            res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        }
        else {
            const { rows: categories } = await CategoryModel.getCategoriesFromVideoGame(client, videoGameId);
            if (categories !== undefined) {
                res.json(categories);
            }
            else {
                res.status(HTTPStatus.NOT_FOUND).send("Id not found");
            }
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
 * @param {Request} req The type id and video game id as parameters from the category to update and the new type id and/or the new video game id inside of the body
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.updateCategory = async (req, res) => {
    const typeId = parseInt(req.params.typeId);
    const videoGameId = parseInt(req.params.videoGameId);
    const model = {
        type_id: ["number", "optional"],
        game_id: ["number", "optional"]
    }
    const body = req.body;
    if (!utils.isValidObject(body, model)) {
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
        return;
    }

    const client = await pool.connect();
    const {
        type_id: newTypeId,
        video_game_id: newVideoGameId
    } = body;

    const updateValues = {
        type_id: newTypeId,
        video_game_id: newVideoGameId
    };


    try {
        const typeIdToTry = newTypeId ?? typeId;
        const videoGameIdToTry = newVideoGameId ?? videoGameId;

        if (typeIdToTry !== typeId || videoGameIdToTry !== videoGameId) {
            const response = await validateIds(client, typeIdToTry, videoGameIdToTry);
            if (response !== undefined) {
                res.status(response.status).send(`New ${response.message}`);
                return;
            }
        }

        const {rowsCount} = await CategoryModel.updateCategory(client, typeId, videoGameId, updateValues);
        if(rowsCount){
            res.sendStatus(HTTPStatus.NO_CONTENT);
        }
        else{
            res.status(HTTPStatus.NOT_FOUND).send("Category not found");
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Delete a category
 * 
 * @param {Request} req The type id and the video game id from the category to delete as parameters
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.deleteCategory = async (req, res) => {
    const client = await pool.connect();
    const typeId = parseInt(req.params.typeId);
    const videoGameId = parseInt(req.params.videoGameId);
    try {
        if (isNaN(typeId) || isNaN(videoGameId)) {
            res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        }
        else {
            const { rowsCount } = await CategoryModel.deleteCategory(client, typeId, videoGameId);
            if (rowsCount) {
                res.sendStatus(HTTPStatus.NO_CONTENT);
            }
            else {
                res.status(HTTPStatus.NOT_FOUND).send("Id not found for one or more");
            }
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Delete all categories from a type
 * 
 * @param {Request} req The type id as paramaters
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.deleteCategoriesFromType = async (req, res) => {
    const client = await pool.connect();
    const typeId = parseInt(req.params.typeId);
    try {
        if (isNaN(typeId)) {
            res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        }
        else {
            const { rowsCount } = await CategoryModel.deleteCategoriesFromType(client, typeId);
            if (rowsCount) {
                res.sendStatus(HTTPStatus.NO_CONTENT);
            }
            else {
                res.status(HTTPStatus.NOT_FOUND).send("Id not found");
            }
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Delete all categories from a video game
 * 
 * @param {Request} req The video game id as parameters
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.deleteCategoriesFromVideoGame = async (req, res) => {
    const client = await pool.connect();
    const videoGameId = parseInt(req.params.videoGameId);
    try {
        if (isNaN(videoGameId)) {
            res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        }
        else {
            const { rowsCount } = await CategoryModel.deleteCategoriesFromVideoGame(client, videoGameId);
            if (rowsCount) {
                res.status(HTTPStatus.NO_CONTENT);
            }
            else {
                res.status(HTTPStatus.NOT_FOUND).send("Id not found");
            }
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

