/**
 * @swagger
 * /videoGame/:
 *  get:
 *      tags:
 *          - VideoGame
 *      description: Get all video games
 *      responses : 
 *          200:
 *            $ref: '#/components/responses/VideoGamesFound'
 *          404:
 *            description: No video games found
 *          500:
 *            description: Internal server error
 */
/**
 * @swagger
 * /videoGame/{id}:
 *  get:
 *      tags:
 *          - VideoGame
 *      description: Get a specific video game
 *      parameters:
 *          - name: id
 *            description: Id of the video game
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses : 
 *          200:
 *            $ref: '#/components/responses/VideoGameFound'
 *          400:
 *            description: Id must be a Number 
 *          404:
 *            description: Video game not found
 *          500:
 *            description: Internal server error
 */


/**
 * @swagger
 * /videoGame/:
 *  post:
 *      tags:
 *          - VideoGame
 *      description: Create a new video game
 *      requestBody: 
 *          $ref: '#/components/requestBodies/createVideoGame'
 *      responses : 
 *          201:
 *            description: The video game is created
 *          400:
 *            description: Some fields are missing/incorrect
 *          500:
 *            description: Internal server error
 */
/**
 * @swagger
 * /videoGame/{id}:
 *  patch:
 *      tags:
 *          - VideoGame
 *      description: Update a video game by its id
 *      requestBody: 
 *          $ref: '#/components/requestBodies/updateVideoGame'
 *      parameters:
 *          - name: id
 *            description: Id of the video game
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses : 
 *          204:
 *            description: The video game is updated
 *          400:
 *            description: Some fields are missing
 *          404:
 *            description: Video game not found
 *          500:
 *            description: Internal server error
 */
/**
 * @swagger
 * /videoGame/{id}:
 *  delete:
 *      tags:
 *          - VideoGame
 *      description: Delete a video game
 *      parameters:
 *          - name: id
 *            description: Id of the video game
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses : 
 *          204:
 *            description: The video game is deleted
 *          404:
 *            description: The video game is not found
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