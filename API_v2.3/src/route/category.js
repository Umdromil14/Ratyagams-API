const Authorization = require("../middleware/authorization");
const JWTMiddleWare = require("../middleware/identification");
const CategoryController = require('../controller/category');
const Router = require("express-promise-router");
const router = new Router();

/**
 * @swagger
 * /category:
 *  post:
 *       tags:
 *           - Category
 *       description: Creating a new category
 *       security:
 *           - bearerAuth: []
 *       requestBody:
 *           $ref: '#/components/requestBodies/CategoryToAdd'
 *       responses:
 *           201:
 *               $ref: '#/components/responses/CategoryAdded'
 *           400:
 *               description: Invalid request body or invalid JWT token
 *           401:
 *               $ref: '#/components/responses/MissingJWT'
 *           403:
 *               $ref: '#/components/responses/MustBeAdmin'
 *           404:
 *               description: Genre id or video game id not found
 *           409:
 *               description: Category already exists
 *           500:
 *               description: Internal server error
 */
router.post("/", JWTMiddleWare.identification, Authorization.mustBeAdmin, CategoryController.createCategory);

/**
 * @swagger
 * /category:
 *  get:
 *      tags:
 *          - Category
 *      description: Get a category or all the categories
 *      parameters:
 *          - name: genreId
 *            description: The genre id
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
 *      responses:
 *          200:
 *              $ref: '#/components/responses/CategoryFound'
 *          400:
 *              description: Id(s) must be a number
 *          404:
 *              description: No category found
 *          500:
 *              description: Internal server error
 */
router.get("/", CategoryController.goToGet);

/**
 * @swagger
 * /category/{genreId}/{videoGameId}:
 *  patch:
 *      tags:
 *          - Category
 *      description: Update a category
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: genreId
 *            description: The genre id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *          - name: videoGameId
 *            description: The video game id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      requestBody:
 *          $ref: '#/components/requestBodies/CategoryToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/CategoryUpdated'
 *          400:
 *              description: Id must be a number or invalid request body or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: Category or new genre id or new video game id not found
 *          409:
 *              description: Category already exists with new genre id and/or new video game id
 *          500:
 *              description: Internal server error
 */
router.patch("/:genreId/:videoGameId", JWTMiddleWare.identification, Authorization.mustBeAdmin, CategoryController.updateCategory);

/**
 * @swagger
 * /category/{genreId}/{videoGameId}:
 *  delete:
 *      tags:
 *          - Category
 *      description: Delete a category
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: genreId
 *            description: The genre id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *          - name: videoGameId
 *            description: The video game id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/CategoryDeleted'
 *          400:
 *              description: Id must be a number or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: Category not found
 *          500:
 *              description: Internal server error
 */
router.delete("/:genreId/:videoGameId", JWTMiddleWare.identification, Authorization.mustBeAdmin, CategoryController.deleteCategory);

module.exports = router;