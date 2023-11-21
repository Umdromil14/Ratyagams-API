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
 *              $ref: '#/components/responses/VideoGameFound'
 *          400:
 *              description: Id must be a Number 
 *          404:
 *              description: Video game not found
 *          500:
 *              description: Internal server error
 */


/**
 * @swagger
 * /videoGame:
 *  post:
 *      tags:
 *          - VideoGame
 *      description: Create a new video game
 *      security:
 *          - bearerAuth: []
 *      requestBody: 
 *          $ref: '#/components/requestBodies/VideoGameToAdd'
 *      responses : 
 *          201:
 *              $ref: '#/components/responses/VideoGameAdded'
 *          400:
 *              description: Invalid request body or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /videoGame/{id}:
 *  patch:
 *      tags:
 *          - VideoGame
 *      description: Update a video game by its id
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: id
 *            description: Id of the video game
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      requestBody:
 *          $ref: '#/components/requestBodies/VideoGameToUpdate'
 *      responses : 
 *          204:
 *              $ref: '#/components/responses/VideoGameUpdated'
 *          400:
 *              description: Id must be an Number or invalid request body or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: Video game not found
 *          500:
 *              description: Internal server error
 */
/**
 * @swagger
 * /videoGame/{id}:
 *  delete:
 *      tags:
 *          - VideoGame
 *      description: Delete a video game
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: id
 *            description: Id of the video game
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses : 
 *          204:
 *              $ref: '#/components/responses/VideoGameDeleted'
 *          400:
 *              description: Id must be an Number or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: Video game not found
 *          500:
 *              description: Internal server error
 */

const AuthoMiddleware = require('../middleware/Authorization');
const JWTMiddleWare = require('../middleware/Identification');
const VideoGameController = require("../controller/videoGame.js");
const Router = require("express-promise-router");
const router = new Router();

// TODO get by name /?id=&name= -> pas de "" pour name
router.get("/", VideoGameController.getVideoGame);
router.post("/", JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, VideoGameController.postVideoGame);
router.patch("/:id", JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, VideoGameController.updateVideoGame);
router.delete("/:id", JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, VideoGameController.deleteVideoGame);

module.exports = router;