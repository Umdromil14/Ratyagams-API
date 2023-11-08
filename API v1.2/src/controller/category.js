const pool = require("../model/database");
const CategoryModel = require("../model/category");
const tools = require("../tools");

module.exports.createCategory = async (req, res) => {
    const model = {
        type_id : ["number"],
        video_game_id : ["number"]
    }
    const body = req.body;
    if(!tools.isValidObject(body, model)){
        res.status(400).send("Invalid body");
        return;
    }

    const client = await pool.connect();
    const {
        type_id: typeId,
        video_game_id: videoGameId} = body;
    try {
        const response = await CategoryModel.createCategory(client, typeId, videoGameId);
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

module.exports.getCategories = async (req, res) => {
    const client = await pool.connect();
    try {
        const{rows: categories} = await CategoryModel.getCategories(client);
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release()
    }
}

module.exports.getCategory = async (req, res) => {
    const client = await pool.connect();
    const typeIdTexte = req.params.typeId;
    const typeId = parseInt(typeIdTexte);
    const videoGameIdTexte = req.params.videoGameId;
    const videoGameId = parseInt(videoGameIdTexte);
    try {
        if(isNaN(typeId) || isNaN(videoGameId)){
            res.status(400).send("Id must be a number");
        }
        else{
            const {rows : categories} = await CategoryModel.getCategory(client, typeId, videoGameId);
            const category = categories[0];
            if(category !== undefined){
                res.json(category);
            }
            else{
                res.status(404).send("Id not found for one or more");
            }
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally{
        client.release();
    }
}

module.exports.getCategoriesFromType = async (req, res) => {
    const client = await pool.connect();
    const typeIdTexte = req.params.typeId;
    const typeId = parseInt(typeIdTexte);
    try {
        if(isNaN(typeId)){
            res.status(400).send("Id must be a number");
        }
        else{
            const {rows : categories} = await CategoryModel.getCategoriesFromType(client, typeId);
            if(categories !== undefined){
                res.json(categories);
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

module.exports.getCategoriesFromVideoGame = async (req, res) => {
    const client = await pool.connect();
    const videoGameIdTexte = req.params.videoGameId;
    const videoGameId = parseInt(videoGameIdTexte);
    try {
        if(isNaN(videoGameId)){
            res.status(400).send("Id must be a number");
        }
        else{
            const {rows : categories} = await CategoryModel.getCategoriesFromVideoGame(client, videoGameId);
            if(categories !== undefined){
                res.json(categories);
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

module.exports.updateCategory = async (req, res) => {
    const model = {
        type_id : ["number"],
        video_game_id : ["number"],
        new_type_id : ["number", "optional"],
        new_video_game_id : ["number", "optional"]
    }
    const body = req.body;
    if(!tools.isValidObject(body, model)){
        res.status(400).send("Invalid body");
        return;
    }

    const client = await pool.connect();
    const {
        type_id : typeId,
        video_game_id : videoGameId,
        new_type_id : newTypeId,
        new_video_game_id : newVideoGameId
    } = body;
    try {
        if(isNaN(typeId) || isNaN(videoGameId)){
            res.status(400).send("Id must be a number");
        }
        else{
            const {rows : categories} = await CategoryModel.getCategory(client, typeId, videoGameId);
            const category = categories[0];
            if(category !== undefined){
                const response = await CategoryModel.updateCategory(client, typeId, videoGameId, newTypeId, newVideoGameId);
                if(response){
                    res.status(200).send("Update done");
                }
                else{
                    res.status(200).send("Update failed");
                }
            }
            else{
                res.status(404).send("Id not found for one or more");
            }
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally{
        client.release();
    }
}

module.exports.deleteCategory = async (req, res) => {
    const client = await pool.connect();
    const typeIdTexte = req.params.typeId;
    const typeId = parseInt(typeIdTexte);
    const videoGameIdTexte = req.params.videoGameId;
    const videoGameId = parseInt(videoGameIdTexte);
    try {
        if(isNaN(typeId) || isNaN(videoGameId)){
            res.status(400).send("Id must be a number");
        }
        else{
            const {rows : categories} = await CategoryModel.getCategory(client, typeId, videoGameId);
            const category = categories[0];
            if(category !== undefined){
                client.query("BEGIN");
                const response = await CategoryModel.deleteCategory(client, typeId, videoGameId);
                if(response){
                    await client.query("COMMIT");
                    res.status(200).send("Delete done");
                }
                else{
                    res.status(200).send("Delete failed");
                }
            }
            else{
                res.status(404).send("Id not found for one or more");
            }
        }
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.sendStatus(500);
    } finally{
        client.release();
    }
}

module.exports.deleteCategoriesFromType = async (req, res) => {
    const client = await pool.connect();
    const typeIdTexte = req.params.typeId;
    const typeId = parseInt(typeIdTexte);
    try {
        if(isNaN(typeId)){
            res.status(400).send("Id must be a number");
        }
        else{
            const {rows : categories} = await CategoryModel.getCategoriesFromType(client, typeId);
            if(categories !== undefined){
                client.query("BEGIN");
                const response = await CategoryModel.deleteCategoriesFromType(client, typeId);
                if(response){
                    client.query("COMMIT");
                    res.status(200).send("Delete done");
                }
                else{
                    res.status(200).send("Delete failed");
                }
            }
            else{
                res.status(404).send("Id not found");
            }
        }
    } catch (error) {
        client.query("ROLLBACK");
        console.error(error);
        res.sendStatus(500);
    } finally{
        client.release();
    }
}

module.exports.deleteCategoriesFromVideoGame = async (req, res) => {
    const client = await pool.connect();
    const videoGameIdTexte = req.params.videoGameId;
    const videoGameId = parseInt(videoGameIdTexte);
    try {
        if(isNaN(videoGameId)){
            res.status(400).send("Id must be a number");
        }
        else{
            client.query("BEGIN");
            const {rows : categories} = await CategoryModel.getCategoriesFromVideoGame(client, videoGameId);
            if(categories !== undefined){
                const response = await CategoryModel.deleteCategoriesFromVideoGame(client, videoGameId);
                if(response){
                    await client.query("COMMIT");
                    res.status(200).send("Delete done");
                }
                else{
                    res.status(200).send("Delete failed");
                }
            }
            else{
                res.status(404).send("Id not found");
            }
        }
    } catch (error) {
        client.query("ROLLBACK");
        console.error(error);
        res.sendStatus(500);
    } finally{
        client.release();
    }
}