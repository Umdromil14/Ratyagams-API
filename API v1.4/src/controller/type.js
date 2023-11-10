const pool = require("../model/database");
const TypeModel = require("../model/type");
const CategoryModel = require("../model/category");
const tools = require("../tools/utils");
const HTTPStatus = require("../tools/HTTPStatus");

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
        if(!TypeModel.typeExistName(client, name)){
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

module.exports.updateType = async (req, res) => {
    const model = {
        id: ["number"],
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
        id,
        new_name: newName,
        new_description: newDescription
    } = body;
    try {
        if(isNaN(id)){
            res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        }
        else{
            if(!TypeModel.typeExistName(client, newName)){
                const {rowsCount} = await TypeModel.updateType(client, id, newName, newDescription);
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