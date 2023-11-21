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
 *              description: Id must be a number
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: Game not found
 *          500:
 *              description: Internal server error
 */

const GameController = require("../controller/game");
const AuthoMiddleware = require('../middleware/Authorization');
const JWTMiddleWare = require("../middleware/Identification");
const Router = require("express-promise-router");
const router = Router();

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
 *              description: Id must be a number or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: No game found
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
 *              description: Id must be a number or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: No game found
 *          500:
 *              description: Internal server error
 */
router.get("/user", JWTMiddleWare.identification, GameController.getGameFromUser);

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
 *              description: Invalid request body or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: User id or publication id not found
 *          409:
 *              description: Game already exists
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
 *              description: Invalid request body or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: Publication id not found
 *          409:
 *              description: Game already exists
 *          500:
 *              description: Internal server error
 */
router.post("/user", JWTMiddleWare.identification, GameController.addGameFromUser);

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
 *              description: Id must be a number, or invalid request body, or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: Game or new publication id not found
 *          409:
 *              description: Game already exists with new publication id
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
 *              description: Id must be a number, or invalid request body, or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: Game, or new user id, or new publication id not found
 *          409:
 *              description: Game already exists with new user id and/or new publication id
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
 *              description: Id must be a number or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: Game not found
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
 *              description: Id must be a number or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: Game not found
 *          500:
 *              description: Internal server error
 */
router.delete("/:userId/:publicationId", JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, GameController.deleteGameFromAdmin);

module.exports = router;