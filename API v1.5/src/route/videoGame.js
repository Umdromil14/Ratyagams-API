/**
 * @swagger
 * /videoGame/:
 *  get:
 *      tags:
 *          - VideoGame
 *      description: get all video games
 *      responses : 
 *          202:
 *            description: video games found
 *          500:
 *            description: Internal server error
 */
/**
 * @swagger
 * /videoGame/{id}:
 *  get:
 *      tags:
 *          - VideoGame
 *      description: get a specific video game
 *      requestBody: 
 *          description : Number id
 *      parameters:
 *          - name: id
 *            description: id of the video game
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses : 
 *          202:
 *            description: video game found
 *          500:
 *            description: Internal server error
 */


/**
 * @swagger
 * /videoGame/:
 *  post:
 *      tags:
 *          - VideoGame
 *      description: create a video game
 *      requestBody: 
 *          $ref: '#/components/requestBodies/createVideoGame'
 *      responses : 
 *          201:
 *            description: video game created
 *          400:
 *            description: Some fields are missing
 *          500:
 *            description: Internal server error
 */
/**
 * @swagger
 * /videoGame/{id}:
 *  patch:
 *      tags:
 *          - VideoGame
 *      description: update a video game
 *      requestBody: 
 *          $ref: '#/components/requestBodies/updateVideoGame'
 *      parameters:
 *          - name: id
 *            description: id of the video game
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses : 
 *          204:
 *            description: video game updated
 *          400:
 *            description: some fields are missing
 *          404:
 *            description: video game not found
 *          500:
 *            description: Internal server error
 */
/**
 * @swagger
 * /videoGame/{id}:
 *  delete:
 *      tags:
 *          - VideoGame
 *      description: delete a video game
 *      requestBody: 
 *          $ref: '#/components/requestBodies/deleteVideoGame'
 *      parameters:
 *          - name: id
 *            description: id of the video game
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses : 
 *          204:
 *            description: video game deleted
 *          400:
 *            description: some fields are missing
 *          404:
 *            description: video game not found
 *          500:
 *            description: Internal server error
 */
const VideoGameController = require("../controller/videoGame.js");
const Router = require("express-promise-router");
const router = new Router();

router.get("/", VideoGameController.getVideoGames);
router.get("/:id", VideoGameController.getVideoGame);
router.post("/", VideoGameController.postVideoGame);
router.patch("/:id", VideoGameController.updateVideoGame);
router.delete("/:id", VideoGameController.deleteVideoGame);


module.exports = router;