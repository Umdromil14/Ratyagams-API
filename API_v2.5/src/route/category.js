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
 *               description: INVALID_INPUT or INVALID_JWT
 *           401:
 *               $ref: '#/components/responses/MissingJWT'
 *           403:
 *               $ref: '#/components/responses/MustBeAdmin'
 *           404:
 *               description: FOREIGN_KEY_NOT_FOUND or JWT_DEPRECATED
 *           409:
 *               description: DUPLICATE_ENTRY
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
 *              description: INVALID_INPUT
 *          404:
 *              description: RESOURCE_NOT_FOUND
 *          500:
 *              description: Internal server error
 */
router.get("/", CategoryController.goToGet);

/**
 * @swagger
 * /category/pagination:
 *  get:
 *      tags:
 *          - Category
 *      description: Get a certain number of categories
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
 *              $ref: '#/components/responses/CategoryFound'
 *          400:
 *              description: INVALID_INPUT
 *          404:
 *              description: RESOURCE_NOT_FOUND
 *          500:
 *              description: Internal server error
 */
router.get("/pagination", CategoryController.getCategoriesWithPagination);

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
router.delete("/:genreId/:videoGameId", JWTMiddleWare.identification, Authorization.mustBeAdmin, CategoryController.deleteCategory);

module.exports = router;