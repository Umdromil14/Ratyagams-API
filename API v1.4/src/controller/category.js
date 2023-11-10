const pool = require("../model/database");
const CategoryModel = require("../model/category");
const TypeModel = require("../model/type");
const VideoGameModel = require("../model/videoGame");
const utils = require("../tools/utils");
const HTTPStatus = require("../tools/HTTPStatus");

async function validateIds(client, typeId, videoGameId) {
    const [typeExists, videoGameExists, categoryExists] = await Promise.all([
        TypeModel.typeExistId(client, typeId),
        VideoGameModel.videoGameExists(client, videoGameId),
        CategoryModel.categoryExist(client, typeId, videoGameId)
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
        const promiseType = TypeModel.typeExistId(client, typeId);
        const promiseVideoGame = VideoGameModel.videoGameExistsById(client, videoGameId);
        const promiseCategory = CategoryModel.categoryExist(client, videoGameId, typeId);
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

