const pool = require("../model/database");
const TypeModel = require("../model/type");
const CategoryModel = require("../model/category");
const tools = require("../tools/utils");
const HTTPStatus = require("../tools/HTTPStatus");

/**
 * Create a type
 * 
 * @param {Request} req The name and the description of the new type inside of the body
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.createType = async (req, res) => {
    const model = {
        name : ["string"],
        description : ["string"]
    }
    const body = req.body;
    if(!tools.isValidObject(body, model)){
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid Body");
    }

    const client = await pool.connect();
    const {name, description} = body;
    try {
        if(!TypeModel.typeExistsName(client, name)){
            await TypeModel.createType(client, name, description);
            res.status(HTTPStatus.CREATED).send("Creation done");
        }
        else{
            res.status(HTTPStatus.CONFLICT).send("Type already exists");
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally{
        client.release();
    }
}

/**
 * Get all types
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getTypes = async (req, res) => {
    const client = await pool.connect();
    try {
        const{rows: types} = await TypeModel.getTypes(client);
        res.json(types);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release()
    }
}

/**
 * Get a type by the id
 * 
 * @param {Request} req The id of the researched type as parameter
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getType = async (req, res) => {
    const client = await pool.connect();
    const id = parseInt(req.params.id);
    try {
        if(isNaN(id)){
            res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        }
        else{
            const {rows : types} = await TypeModel.getType(client, id);
            const type = types[0];
            if(type !== undefined){
                res.json(type);
            }
            else{
                res.status(HTTPStatus.NOT_FOUND).send("Id not found");
            }
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally{
        client.release();
    }
}

/**
 * Update a type
 * 
 * @param {Request} req The type id to update as parameter and the new name and/or new description inside of the body
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.updateType = async (req, res) => {
    const id = parseInt(req.params.id);
    const model = {
        new_name: ["string", "optional"],
        new_description: ["string", "optional"]
    }
    const body = req.body;
    if(!tools.isValidObject(body, model)){
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
        return;
    }

    const client = await pool.connect();
    const {
        new_name: newName,
        new_description: newDescription
    } = body;

    const updateValues = {
        name : newName,
        description : newDescription
    };
    try {
        if(isNaN(id)){
            res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        }
        else{
            if(!TypeModel.typeExistsName(client, newName)){
                const {rowsCount} = await TypeModel.updateType(client, id, updateValues);
                if(rowsCount){
                    res.status(HTTPStatus.NO_CONTENT);
                }
                else{
                    res.status(HTTPStatus.BAD_REQUEST).send("Id not found");
                }
            }
            else{
                res.status(HTTPStatus.CONFLICT).send("New name is already in the database");
            }
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally{
        client.release();
    }
}

/**
 * Delete a type
 * 
 * @param {Request} req The type id to delete as a parameter
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.deleteType = async (req, res) => {
    const client = await pool.connect();
    const id = parseInt(req.params.id);
    try {
        if(isNaN(id)){
            res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        }
        else{
            client.query("BEGIN");
            await CategoryModel.deleteCategoriesFromType(client, id)
            const { rowsCount } = await TypeModel.deleteType(client, id);
            if(rowsCount){
                res.status(HTTPStatus.NO_CONTENT);
            }
            else{
                res.status(HTTPStatus.BAD_REQUEST).send("Id not found");
            }
            client.query("COMMIT");
        }
    } catch (error) {
        client.query("ROLLBACK");
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally{
        client.release();
    }
}