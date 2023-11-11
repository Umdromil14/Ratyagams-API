const pool = require("../model/database");
const PublicationModel = require("../model/publication");
const videoGameModel = require("../model/videoGame");
const platformModel = require("../model/platform");
const gameModel = require("../model/game");
const tools = require("../tools/utils");
const HTTPStatus = require("../tools/HTTPStatus");

/**
 * Get all publications
 * 
 * @param {Request} req 
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
function errorMessage(videoGameExists, platformExists){
    let notFoundMessage = ""
    let value = 0
    if(!videoGameExists){
        notFoundMessage += "Video game and ";
        value++;
    }
    if(!platformExists){
        notFoundMessage += "Platform and ";
        value++;
    }
    notFoundMessage.split(0, 4);
    if(value === 1){
        notFoundMessage += "does not exist";
    }
    else{
        notFoundMessage += "do not exist";
    }
    return notFoundMessage;
}

/**
 * Create a publication
 * 
 * @param {Request} req The platform code, the video game id, the release date, the optional release price and the optional url official store page inside of the body
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
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
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
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
        const promiseVideoGame = videoGameModel.videoGameExistsById(client, videoGameId)
        const promisePlatform = platformModel.platformExists(client, platformCode);
        const [videoGameExists, platformExists] = await Promise.all(promiseVideoGame, promisePlatform);
        if(videoGameExists && platformExists){
            if(! await PublicationModel.publicationExistsByPVB(client, videoGameId, platformCode)){
                await PublicationModel.createPublication(client, platformCode, videoGameId, 
                    releaseDate, releasePrice, storePageURL);
                res.status(HTTPStatus.CREATED).send("Creation sucessfull");
            }
            else{
                res.status(HTTPStatus.CONFLICT).send("Publication already exists");
            }
        }
        else{
            res.status(HTTPStatus.NOT_FOUND).send(errorMessage(videoGameExists, platformExists));
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally{
        client.release();
    }
}

/**
 * Get a publication
 * 
 * @param {Request} req The id of the publication to get as a parameter
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getPublication = async (req, res) => {
    const client = await pool.connect();
    const id = parseInt(req.params.id);
    try{
        if(isNaN(id)){
            res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        }
        else{
            const {rows: publications} = await PublicationModel.getPublication(client, id);
            const publication = publications[0];
            if(publication !== undefined){
                res.json(publication);
            }
            else{
                res.status(HTTPStatus.NOT_FOUND).send("Id not found");
            }
        }
    } catch (error){
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally{
        client.release();
    }
}

/**
 * Get all publications
 * 
 * @param {Request} req 
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getPublications = async (req, res) => {
    const client = await pool.connect();
    try{
        const {rows: publications} = await PublicationModel.getPublications(client);
        res.json(publications);
    } catch (error){
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally{
        client.release();
    }
}

/**
 * Update a publications
 * 
 * @param {Request} req The id of the publication to update as a parameter with the optional values (new platform code, new video game id, new release date, new release price and new store page url) inside of the body
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.updatePublication = async (req, res) => {
    const id = parseInt(req.params.id);
    const model = {
        new_platform_code: ["string", "optional"],
        new_video_game_id: ["number", "optional"],
        new_release_date: ["string", "optional"],
        new_release_price: ["number", "optional"],
        new_store_page_url: ["string", "optional"]
    }
    const body = req.body;
    if(!tools.isValidObject(body, model)){
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
        return;
    }

    const client = await pool.connect();
    const {
        new_platform_code: newPlatformCode,
        new_video_game_id: newVideoGameId,
        new_release_date: newReleaseDate, 
        new_release_price: newReleasePrice,
        new_store_page_url: newStorePageURL} = body;

    const updateValues = {
        platform_code : newPlatformCode,
        video_game_id : newVideoGameId,
        release_date : newReleaseDate,
        release_price : newReleasePrice,
        store_page_url : newStorePageURL
    }
    
    try {
        if(isNaN(id)){
            res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        }
        else{
            const promiseVideoGame = videoGameModel.videoGameExistsById(client, videoGameId)
            const promisePlatform = platformModel.platformExists(client, platformCode);
            const [videoGameExists, platformExists] = await Promise.all(promiseVideoGame, promisePlatform);
            if(videoGameExists && platformExists){
                if(await PublicationModel.publicationExists(client, id)){
                    await PublicationModel.updatePublication(client, id, updateValues);
                }
                else{
                    res.status(HTTPStatus.NOT_FOUND).send("Id not found");
                }
            }
            else{
                res.status(HTTPStatus.NOT_FOUND).send(errorMessage(videoGameExists, platformExists));
            }
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    }finally{
        client.release();
    }
}

/**
 * Delete a publication
 * 
 * @param {Request} req The publication id as parameter
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.deletePublication = async (req, res) => {
    const client = await pool.connect();
    const id = parseInt(req.params.id);
    try {
        if(isNaN(id)){
            res.status(HTTPStatus.BAD_REQUEST).send("Id must be a number");
        }
        else{
            await client.query("BEGIN");
            if(await PublicationModel.publicationExist(client, id)){
                await gameModel.deleteGamesFromPublication(client, id);
                const { rowsCount } = await PublicationModel.deletePublication(client, id);
                if(rowsCount){
                    res.sendStatus(HTTPStatus.NO_CONTENT);
                }
            }
            else{
                res.status(HTTPStatus.NOT_FOUND).send("Id not found");
            }
            await client.query("COMMIT");
        }
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    }finally{
        client.release();
    }
}