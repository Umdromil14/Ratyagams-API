const GenreController = require('../controller/genre');
const Authorization = require("../middleware/authorization");
const JWTMiddleWare = require("../middleware/identification");
const Router = require("express-promise-router");
const router = new Router();

/**
 * @swagger
 * /genre:
 *  post:
 *      tags:
 *          - Genre
 *      description: Creating a new genre
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/GenreToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/GenreAdded'
 *          400:
 *              description: Invalid request body or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          409:
 *              description: Genre already exists
 *          500:
 *              description: Internal server error
 */
router.post("/",JWTMiddleWare.identification, Authorization.mustBeAdmin, GenreController.createGenre);

/**
 * @swagger
 * /genre:
 *  get:
 *      tags:
 *          - Genre
 *      description: Get a genre
 *      parameters:
 *          - name: id
 *            description: The genre id
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/GenreFound'
 *          404:
 *              description: No genre found
 *          500:
 *              description: Internal server error
 */
router.get("/", GenreController.getGenres);

/**
 * @swagger
 * /genre/{id}:
 *  patch:
 *      tags:
 *          - Genre
 *      description: Update a genre
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: id
 *            description: The genre id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      requestBody:
 *          $ref: '#/components/requestBodies/GenreToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/GenreUpdated'
 *          400:
 *              description: Id must be a number and/or invalid request body and/or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: Genre id not found
 *          409:
 *              description: Genre already exists with new name
 *          500:
 *              description: Internal server error
 */
router.patch("/:id", JWTMiddleWare.identification, Authorization.mustBeAdmin, GenreController.updateGenre);

/**
 * @swagger
 * /genre/{id}:
 *  delete:
 *      tags:
 *          - Genre
 *      description: Delete a genre
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: id
 *            description: The genre id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/GenreDeleted'
 *          400:
 *              description: Id must be a number or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: Genre not found
 *          500:
 *              description: Internal server error
 */
router.delete("/:id", JWTMiddleWare.identification, Authorization.mustBeAdmin, GenreController.deleteGenre);

module.exports = router;