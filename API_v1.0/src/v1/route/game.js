const GameController = require("../controller/game");
const AuthoMiddleware = require('../middleware/Authorization');
const JWTMiddleWare = require("../middleware/Identification");
const Router = require("express-promise-router");
const router = Router();

/**
 * @swagger
 * /game:
 *  post:
 *      tags:
 *          - Game
 *      description: Add a game
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/GameToAddFromAdmin'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/GameAdded'
 *          400:
 *              description: INVALID_INPUT or INVALID_JWT
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: FOREIGN_KEY_NOT_FOUND or JWT_DEPRECATED
 *          409:
 *              description: DUPLICATE_ENTRY
 *          500:
 *              description: Internal server error
 */
router.post("/", JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, GameController.createGameFromAdmin);

/**
 * @swagger
 * /game/user:
 *  post:
 *      tags:
 *          - Game
 *      description: Add a game from the user session
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/GameToAddFromUser'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/GameAdded'
 *          400:
 *              description: INVALID_INPUT or INVALID_JWT
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: FOREIGN_KEY_NOT_FOUND or JWT_DEPRECATED
 *          409:
 *              description: DUPLICATE_ENTRY
 *          500:
 *              description: Internal server error
 */
router.post("/user", JWTMiddleWare.identification, GameController.createGameFromUser);

/**
 * @swagger
 * /game:
 *  get:
 *      tags:
 *          - Game
 *      description: Get one or more games based on query parameters
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: userId
 *            description: The user id
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *          - name: publicationId
 *            description: The publication id
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *          - name: videoGameId
 *            description: The video game id
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *          - name: page
 *            description: The chosen page
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *          - name: limit
 *            description: The max number of returned results
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/GamesFound'
 *          400:
 *              description: INVALID_INPUT or INVALID_JWT
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: RESOURCE_NOT_FOUND or JWT_DEPRECATED
 *          500:
 *              description: Internal server error
 */
router.get("/", JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, GameController.getGameFromAdmin);

/**
 * @swagger
 * /game/count:
 *  get:
 *      tags:
 *          - Game
 *      description: Get games count
 *      responses:
 *          200:
 *              $ref: '#/components/responses/GamesCount'
 *          500:
 *              description: Internal server error
 */
router.get("/count", GameController.getGameCount);

/**
 * @swagger
 * /game/user:
 *  get:
 *      tags:
 *          - Game
 *      description: Get one or more session user's games based on query parameters
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: publicationId
 *            description: The publication id
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *          - name: videoGameId
 *            description: the video game id
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *          - name: page
 *            description: the chosen page
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *          - name: limit
 *            description: The max number of values returned
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/GamesFound'
 *          400:
 *              description: INVALID_INPUT or INVALID_JWT
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: RESOURCE_NOT_FOUND or JWT_DEPRECATED
 *          500:
 *              description: Internal server error
 */
router.get("/user", JWTMiddleWare.identification, GameController.getGameFromUser);

/**
 * @swagger
 * /game/user/{publicationId}:
 *  patch:
 *      tags:
 *          - Game
 *      description: Update a game from the user session
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: publicationId
 *            description: The publication id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      requestBody:
 *          $ref: '#/components/requestBodies/GameToUpdateFromUser'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/GameUpdated'
 *          400:
 *              description: INVALID_INPUT or INVALID_JWT
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: RESOURCE_NOT_FOUND or FOREIGN_KEY_NOT_FOUND or JWT_DEPRECATED
 *          409:
 *              description: DUPLICATE_ENTRY
 *          500:
 *              description: Internal server error
 */
router.patch("/user/:publicationId", JWTMiddleWare.identification, GameController.updateGameFromUser);

/**
 * @swagger
 * /game/{userId}/{publicationId}:
 *  patch:
 *      tags:
 *          - Game
 *      description: Update a game
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: userId
 *            description: The user id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *          - name: publicationId
 *            description: The publication id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      requestBody:
 *          $ref: '#/components/requestBodies/GameToUpdateFromAdmin'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/GameUpdated'
 *          400:
 *              description: INVALID_INPUT or INVALID_JWT
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: RESOURCE_NOT_FOUND or FOREIGN_KEY_NOT_FOUND or JWT_DEPRECATED
 *          409:
 *              description: DUPLICATE_ENTRY
 *          500:
 *              description: Internal server error
 */
router.patch("/:userId/:publicationId", JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, GameController.updateGameFromAdmin);

/**
 * @swagger
 * /game/user/{publicationId}:
 *  delete:
 *      tags:
 *          - Game
 *      description: Delete a game from the user session
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: publicationId
 *            description: The publication id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/GameDeleted'
 *          400:
 *              description: INVALID_INPUT or INVALID_JWT
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: RESOURCE_NOT_FOUND or JWT_DEPRECATED
 *          500:
 *              description: Internal server error
 */
router.delete("/user/:publicationId", JWTMiddleWare.identification, GameController.deleteGameFromUser);

/**
 * @swagger
 * /game/{userId}/{publicationId}:
 *  delete:
 *      tags:
 *          - Game
 *      description: Delete a game
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: userId
 *            description: The user id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *          - name: publicationId
 *            description: The publication id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/GameDeleted'
 *          400:
 *              description: INVALID_INPUT or INVALID_JWT
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: RESOURCE_NOT_FOUND or JWT_DEPRECATED
 *          500:
 *              description: Internal server error
 */
router.delete("/:userId/:publicationId", JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, GameController.deleteGameFromAdmin);

module.exports = router;