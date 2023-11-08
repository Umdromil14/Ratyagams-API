const pool = require("../model/database");
const PublicationModel = require("../model/publication");
const videoGameModel = require("../model/videoGame");
const platformModel = require("../model/platform");
const gameModel = require("../model/game");
const tools = require("../tools");

module.exports.createPublication = async (req, res) => {
    const model = {
        platform_code: ["string"],
        video_game_id: ["number"],
        release_date: ["string"],
        release_price: ["number", "optional"],
        store_page_url: ["string", "optional"]
    }
    const body = req.body;
    if(!tools.isValidObject(body, model)){
        res.status(400).send("Invalid body");
        return;
    }
    
    const client = await pool.connect();
    const {
        platform_code: platformCode,
        video_game_id: videoGameId,
        release_date: releaseDate, 
        release_price: releasePrice,
        store_page_url: storePageURL} = body;
    
    try {
        const response = await PublicationModel.createPublication(client, platformCode, videoGameId, 
            releaseDate, releasePrice, storePageURL);
        if(response){
            res.status(200).send("Creation sucessfull");
        }
        else{
            res.status(404).send("Creation failed");
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally{
        client.release();
    }
}

module.exports.getPublication = async (req, res) => {
    const client = await pool.connect();
    const idTexte = req.params.id;
    const id = parseInt(idTexte);
    try{
        if(isNaN(id)){
            res.status(400).send("Id must be a number");
        }
        else{
            const {rows: publications} = await PublicationModel.getPublication(client, id);
            const publication = publications[0];
            if(publication !== undefined){
                res.json(publication);
            }
            else{
                res.status(404).send("Id not found");
            }
        }
    } catch (error){
        console.error(error);
        res.sendStatus(500);
    } finally{
        client.release();
    }
}

module.exports.getPublications = async (req, res) => {
    const client = await pool.connect();
    try{
        const {rows: publications} = await PublicationModel.getPublications(client);
        res.json(publications);
    } catch (error){
        console.error(error);
        res.sendStatus(500);
    } finally{
        client.release();
    }
}

module.exports.updatePublication = async (req, res) => {
    const model = {
        id: ["number"],
        new_id: ["number", "optional"],
        new_platform_code: ["string", "optional"],
        new_video_game_id: ["number", "optional"],
        new_release_date: ["string", "optional"],
        new_release_price: ["number", "optional"],
        new_store_page_url: ["string", "optional"]
    }
    const body = req.body;
    if(!tools.isValidObject(body, model)){
        res.status(400).send("Invalid body");
        return;
    }

    const client = await pool.connect();
    const {id: id, 
        new_id: newId,
        new_platform_code: newPlatformCode,
        new_video_game_id: newVideoGameId,
        new_release_date: newReleaseDate, 
        new_release_price: newReleasePrice,
        new_store_page_url: newStorePageURL} = body;
    
    try {
        if(isNaN(id)){
            res.status(400).send("Id must be a number");
        }
        else{
            const {rows: publications} = await PublicationModel.getPublication(client, id);
            const publication = publications[0];
            if(publication !== undefined){
                const response = await PublicationModel.updatePublication(client, id, newId, newPlatformCode, 
                    newVideoGameId, newReleaseDate, newReleasePrice, newStorePageURL);
                if(response){
                    res.status(200).send("Update done");
                }
                else{
                    res.status(404).send("Update failed");
                }
            }
            else{
                res.status(400).send("Id not found");
            }
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }finally{
        client.release();
    }
}

//! vérif transaction pour supprimer les jeux de l'utilisateur
module.exports.deletePublication = async (req, res) => {
    const client = await pool.connect();
    const idTexte = req.params.id;
    const id = parseInt(idTexte);
    try {
        if(isNaN(id)){
            res.status(400).send("Id must be a number");
        }
        else{
            if(PublicationModel.publicationExist(client, id)){
                client.query("BEGIN");
                const firstRep = await gameModel.deleteGamesByPublication(client, id);
                if(firstRep){
                    const response = await PublicationModel.deletePublication(client, id);
                    if(response){
                        await client.query("COMMIT");
                        res.status(200).send("Delete done");
                    } else{
                        res.status(404).send("Delete failed");
                    }
                }
                else{
                    res.status(404).send("Deleting users games failed");
                }
            }
            else{
                res.status(400).send("Id not found");
            }
        }
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.sendStatus(500);
    }finally{
        client.release();
    }
}