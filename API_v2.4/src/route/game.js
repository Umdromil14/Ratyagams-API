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
 *              description: INVALID_PARAMETER or INVALID_JWT
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
router.post("/", JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, GameController.addGameFromAdmin);

/**
 * @swagger
 * /game/user:
 *  post:
 *      tags:
 *          - Game
 *      description: Add a game
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/GameToAddFromUser'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/GameAdded'
 *          400:
 *              description: INVALID_PARAMETER or INVALID_JWT
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: FOREIGN_KEY_NOT_FOUND or JWT_DEPRECATED
 *          409:
 *              description: DUPLICATE_ENTRY
 *          500:
 *              description: Internal server error
 */
router.post("/user", JWTMiddleWare.identification, GameController.addGameFromUser);

/**
 * @swagger
 * /game:
 *  get:
 *      tags:
 *          - Game
 *      description: Get all games, or all games by user id, or all games by publication id, or a game by user id and publication id
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: userId
 *            description: The id of the user
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *          - name: publicationId
 *            description: The id of the publication
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/GamesFound'
 *          400:
 *              description: INVALID_PARAMETER or INVALID_JWT
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
 * /game/user:
 *  get:
 *      tags:
 *          - Game
 *      description: Get all session user's games or a game by publication id
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: publicationId
 *            description: The id of the publication
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/GamesFound'
 *          400:
 *              description: INVALID_PARAMETER or INVALID_JWT
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
 *      description: Update a game
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: publicationId
 *            description: The id of the publication
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
 *              description: INVALID_PARAMETER or INVALID_JWT
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
 *            description: The id of the user
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *          - name: publicationId
 *            description: The id of the publication
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
 *              description: INVALID_PARAMETER or INVALID_JWT
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
 *      description: Delete a game
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: publicationId
 *            description: The id of the publication
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/GameDeleted'
 *          400:
 *              description: INVALID_PARAMETER or INVALID_JWT
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
 *            description: The id of the user
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *          - name: publicationId
 *            description: The id of the publication
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/GameDeleted'
 *          400:
 *              description: INVALID_PARAMETER or INVALID_JWT
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