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
 *              description: INVALID_INPUT or INVALID_JWT
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              $ref: '#/components/responses/DeprecatedJWT'
 *          409:
 *              description: DUPLICATE_ENTRY
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
 *          400:
 *              description: INVALID_INPUT
 *          404:
 *              description: RESOURCE_NOT_FOUND
 *          500:
 *              description: Internal server error
 */
router.get("/", GenreController.getGenres);

/**
 * @swagger
 * /genre/pagination:
 *  get:
 *      tags:
 *          - Genre
 *      description: Get a genre with pagination
 *      parameters:
 *          - name: page
 *            description: the chosen page
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *          - name: limit
 *            description: the number of users per page
 *            in: query
 *            required: false
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              $ref: '#/components/responses/GenreFound'
 *          400:
 *              description: INVALID_INPUT
 *          404:
 *              description: RESOURCE_NOT_FOUND
 *          500:
 *              description: Internal server error
 */
router.get("/pagination", GenreController.getGenresPagination);


/**
 * @swagger
 * /genre/count:
 *  get:
 *      tags:
 *          - Genre
 *      description: Get number of genres
 *      responses:
 *          200:
 *              $ref: '#/components/responses/GenresCount'
 *          404:
 *              description: RESOURCE_NOT_FOUND
 *          500:
 *              description: Internal server error
 */
router.get("/count", GenreController.getGenresCount);


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
 *              description: INVALID_INPUT or INVALID_JWT
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: RESOURCE_NOT_FOUND or JWT_DEPRECATED
 *          409:
 *              description: DUPLICATE_ENTRY
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
router.delete("/:id", JWTMiddleWare.identification, Authorization.mustBeAdmin, GenreController.deleteGenre);

module.exports = router;