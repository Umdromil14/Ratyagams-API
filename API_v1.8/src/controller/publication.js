/**
 * @swagger
 * components:
 *  schemas:
 *      Publication:
 *          type: object
 *          properties:
 *              platform_code:
 *                  type: string
 *                  description: The platform code
 *              video_game_id:
 *                  type: integer
 *                  description: The video game id
 *              release_date:
 *                  type: string
 *                  format: date
 *                  description: The release date (YYYY-MM-DD)
 *              release_price:
 *                  type: number
 *                  description: The game price when it's released
 *              store_page_url:
 *                  type: string
 *                  description: The url of the official store page where the game is available to buy
 */

/**
 * @swagger
 * components:
 *  responses:
 *      PublicationAdded:
 *          description: The publication was added
 *  requestBodies:
 *      PublicationToAdd:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          platform_code:
 *                              type: string
 *                              description: The platform code
 *                          video_game_id:
 *                              type: integer
 *                              description: The video game id
 *                          release_date:
 *                              type: string
 *                              format: date
 *                              description: The release date (YYYY-MM-DD)
 *                          release_price:
 *                              type: number
 *                              description: The game price when it's released
 *                          store_page_url:
 *                              type: string
 *                              description: The url of the official store page where the game is available to buy
 *                      required:
 *                          - platform_code
 *                          - video_game_id
 *                          - release_date
 */

/**
 * @swagger
 * components:
 *  responses:
 *      PublicationFound:
 *          description: Publication was found
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Publication'
 */

/**
 * @swagger
 * components:
 *  responses:
 *      PublicationsFound:
 *          description: Publications were found
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Publication'
 */

/**
 * @swagger
 * components:
 *  responses:
 *      PublicationUpdated:
 *          description: The publication was updated
 *  requestBodies:
 *      PublicationToUpdate:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          platform_code:
 *                              type: string
 *                              description: The platform code
 *                          video_game_id:
 *                              type: integer
 *                              description: The video game id
 *                          release_date:
 *                              type: string
 *                              format: date
 *                              description: The release date (YYYY-MM-DD)
 *                          release_price:
 *                              type: number
 *                              description: The game price when it's released
 *                          store_page_url:
 *                              type: string
 *                              description: The url of the official store page where the game is available to buy
 */

/**
 * @swagger
 * components:
 *  responses:
 *      PublicationDeleted:
 *          description: The publication was deleted
 */
const pool = require("../model/database");
const PublicationModel = require("../model/publication");
const videoGameModel = require("../model/videoGame");
const platformModel = require("../model/platform");
const gameModel = require("../model/game");
const tools = require("../tools/utils");
const HTTPStatus = require("../tools/HTTPStatus");

const { publicationToGetSchema } = require("../schema/publication");

/**
 * Create the personnal error message depending on which Id isn't in the database
 * 
 * @param {boolean} videoGameExists `true` if the game exists, `false` otherwise
 * @param {boolean} platformExists `true` if the platform exists, `false` otherwise
 * 
 * @returns {string} The message containing the good error message
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
    notFoundMessage = notFoundMessage.slice(0, -4);
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
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.createPublication = async (req, res) => {
    const model = {
        platform_code: ["string"],
        video_game_id: ["number"],
        release_date: ["date"],
        release_price: ["number", "optional"],
        store_page_url: ["string", "optional"]
    }
    const body = req.body;
    if(!tools.isValidObject(body, model) || !tools.isValidDate(body.release_date)){
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
        return;
    }
    
    const client = await pool.connect();
    const {
        platform_code: platformCode,
        video_game_id: videoGameId,
        release_price: releasePrice,
        store_page_url: storePageURL} = body;
    const releaseDate = new Date(body.release_date);
    
    try {
        const promiseVideoGame = videoGameModel.videoGameExists(client, videoGameId)
        const promisePlatform = platformModel.platformExists(client, platformCode);
        const [videoGameExists, platformExists] = await Promise.all([promiseVideoGame, promisePlatform]);
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

// TODO swagger
/**
 * Get one or more publications
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.getPublication = async (req, res) => {
    const result = publicationToGetSchema.safeParse(req.query);
    if (!result.success) {
        res.status(HTTPStatus.BAD_REQUEST).send(
            result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(" & ")
        );
        return;
    }
    const { publicationId, videoGameId, videoGameName, platformCode } = result.data;

    const client = await pool.connect();
    try {
        const { rows } = await PublicationModel.getPublication(client, publicationId, platformCode, videoGameId, videoGameName);
        if (rows.length === 0) {
            res.status(HTTPStatus.NOT_FOUND).send("No publication found");
        } else {
            res.json(rows);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
    } finally {
        client.release();
    }
}

/**
 * Update a publications
 * 
 * @param {Request} req
 * @param {Response} res
 * 
 * @returns {Promise<void>}
 */
module.exports.updatePublication = async (req, res) => {
    const id = parseInt(req.params.id);
    const model = {
        platform_code: ["string", "optional"],
        video_game_id: ["number", "optional"],
        release_date: ["date", "optional"],
        release_price: ["number", "optional"],
        store_page_url: ["string", "optional"]
    }
    const body = req.body;
    if(!tools.isValidObject(body, model) || (body.release_date && !tools.isValidDate(body.release_date))){
        res.status(HTTPStatus.BAD_REQUEST).send("Invalid body");
        return;
    }

    const client = await pool.connect();
    const {
        platform_code: newPlatformCode,
        video_game_id: newVideoGameId,
        release_price: newReleasePrice,
        store_page_url: newStorePageURL} = body;
    const newReleaseDate = body.release_date ? new Date(body.release_date) : undefined;

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
            const promiseVideoGame = videoGameModel.videoGameExists(client, newVideoGameId);
            const promisePlatform = platformModel.platformExists(client, newPlatformCode);
            const [videoGameExists, platformExists] = await Promise.all([promiseVideoGame, promisePlatform]);
            if((newPlatformCode === undefined && newVideoGameId === undefined) || (videoGameExists && platformExists)){
                if(await PublicationModel.publicationExists(client, id)){
                    await PublicationModel.updatePublication(client, id, updateValues);
                    res.sendStatus(HTTPStatus.NO_CONTENT);
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
 * @param {Request} req
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
            if(await PublicationModel.publicationExists(client, id)){
                await gameModel.deleteGamesFromPublication(client, id);
                const { rowCount } = await PublicationModel.deletePublication(client, id);
                if(rowCount){
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