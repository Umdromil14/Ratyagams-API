const pool = require("../model/database");
const TypeModel = require("../model/type");
const CategoryModel = require("../model/category");
const tools = require("../tools/utils");

module.exports.createType = async (req, res) => {
    const model = {
        name : ["string"],
        description : ["string"]
    }
    const body = req.body;
    if(!tools.isValidObject(body, model)){
        res.status(400).send("Invalid body");
        return;
    }

    const client = await pool.connect();
    const {name, description} = body;
    try {
        const response = await TypeModel.createType(client, name, description);
        //! todo : check if name already exists
        if(response){
            res.status(200).send("Creation done");
        }
        else{
            res.status(400).send("Creation failed");
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
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
        res.sendStatus(500);
    } finally {
        client.release()
    }
}
//! si change id, alors via code
module.exports.getType = async (req, res) => {
    const client = await pool.connect();
    const idTexte = req.params.id;
    const id = parseInt(idTexte);
    try {
        if(isNaN(id)){
            res.status(400).send("Id must be a number");
        }
        else{
            const {rows : types} = await TypeModel.getType(client, id);
            const type = types[0];
            if(type !== undefined){
                res.json(type);
            }
            else{
                res.status(404).send("Id not found");
            }
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally{
        client.release();
    }
}

module.exports.updateType = async (req, res) => {
    const model = {
        id: ["number"],
        new_id: ["number", "optional"],
        new_name: ["string", "optional"],
        new_description: ["string", "optional"]
    }
    const body = req.body;
    if(!tools.isValidObject(body, model)){
        res.status(400).send("Invalid body");
        return;
    }

    const client = await pool.connect();
    const {
        id,
        new_id: newId,
        new_name: newName,
        new_description: newDescription
    } = body;
    try {
        if(isNaN(id)){
            res.status(400).send("Id must be a number");
        }
        else{
            const {rows : types} = await TypeModel.getType(client, id);
            const type = types[0];
            if(type !== undefined){
                const response = await TypeModel.updateType(client, id, newId, newName, newDescription);
                if(response){
                    res.status(200).send("Update done");
                }
                else{
                    res.status(200).send("Update failed");
                }
            }
            else{
                res.status(404).send("Id not found");
            }
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally{
        client.release();
    }
}

// todo : transaction
module.exports.deleteType = async (req, res) => {
    const client = await pool.connect();
    const idTexte = req.params.id;
    const id = parseInt(idTexte);
    try {
        if(isNaN(id)){
            res.status(400).send("Id must be a number");
        }
        else{
            client.query("BEGIN");
            const {rows : types} = await TypeModel.getType(client, id);
            const type = types[0];
            if(type !== undefined){
                const firstRep = await CategoryModel.deleteCategoriesFromType(client, id)
                if(firstRep){
                    const response = await TypeModel.deleteType(client, id);
                    if(response){
                        res.status(200).send("Delete done");
                    }
                    else{
                        res.status(200).send("Delete failed");
                    }
                }
                else{
                    res.status(400).send("Deleting categories failed");
                }
            }
            else{
                res.status(404).send("Id not found");
            }
            client.query("COMMIT");
        }
    } catch (error) {
        client.query("ROLLBACK");
        console.error(error);
        res.sendStatus(500);
    } finally{
        client.release();
    }
}