const AuthoMiddleware = require('../middleware/Authorization');
const JWTMiddleWare = require('../middleware/Identification');
const VideoGameController = require("../controller/videoGame.js");
const Router = require("express-promise-router");
const router = new Router();

/**
 * @swagger
 * /videoGame:
 *  get:
 *      tags:
 *          - VideoGame
 *      description: Get all video games or video games by name or id
 *      parameters:
 *          - name: id
 *            description: Id of the video game
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *          - name: name
 *            description: Name of the video game
 *            in: query
 *            required: false
 *            schema:
 *              type: string
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
router.get("/", VideoGameController.getVideoGame);


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
router.post("/", JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, VideoGameController.postVideoGame);

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
router.patch("/:id", JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, VideoGameController.updateVideoGame);

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
router.delete("/:id", JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, VideoGameController.deleteVideoGame);

module.exports = router;