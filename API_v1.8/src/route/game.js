// TODO add security

/**
 * @swagger
 * /game:
 *  get:
 *      tags:
 *          - Game
 *      description: Get all games
 *      responses:
 *          200:
 *              $ref: '#/components/responses/GamesFound'
 *          404:
 *              description: No game found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /game/{userId}:
 *  get:
 *      tags:
 *          - Game
 *      description: Get all games of a user
 *      parameters:
 *          - name: userId
 *            description: The id of the user
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/GamesFound'
 *          400:
 *              description: Id must be a number
 *          404:
 *              description: No game found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /game/{userId}/{publicationId}:
 *  get:
 *      tags:
 *          - Game
 *      description: Get a game
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
 *          200:
 *              $ref: '#/components/responses/GameFound'
 *          400:
 *              description: Id must be a number
 *          404:
 *              description: No game found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /game:
 *  post:
 *       tags:
 *           - Game
 *       description: Add a game
 *       requestBody:
 *           $ref: '#/components/requestBodies/GameToAdd'
 *       responses:
 *           201:
 *               $ref: '#/components/responses/GameAdded'
 *           400:
 *               description: Invalid request body
 *           404:
 *               description: User id or publication id not found
 *           409:
 *               description: Game already exists
 *           500:
 *               description: Internal server error
 */

/**
 * @swagger
 * /game/{userId}/{publicationId}:
 *  patch:
 *      tags:
 *          - Game
 *      description: Update a game
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
 *          $ref: '#/components/requestBodies/GameToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/GameUpdated'
 *          400:
 *              description: Id must be a number or invalid request body
 *          404:
 *              description: Game or new user id or new publication id not found
 *          409:
 *              description: Game already exists with new user id and/or new publication id
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /game/{userId}/{publicationId}:
 *  delete:
 *      tags:
 *          - Game
 *      description: Delete a game
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
 *          404:
 *              description: Game not found
 *          500:
 *              description: Internal server error
 */

const GameController = require("../controller/game");
const Router = require("express-promise-router");
const router = Router();

router.get("/", GameController.getAllGames);
router.get("/:userId", GameController.getUserGames);
router.get("/:userId/:publicationId", GameController.getGame);
router.post("/", GameController.postGame);
router.patch("/:userId/:publicationId", GameController.updateGame);
router.delete("/:userId/:publicationId", GameController.deleteGame);

module.exports = router;