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
 *               description: Invalid request body
 *           404:
 *               description: Type id or video game id not found
 *           403:
 *              $ref: '#/components/responses/MustBeAdmin'
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
 *      description: Get a category or all the categories or some of them
 *      parameters:
 *          - name: typeId
 *            description: The type id
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
 * /category/{typeId}/{videoGameId}:
 *  patch:
 *      tags:
 *          - Category
 *      description: Update a category
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: typeId
 *            description: The type id
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
 *              description: Id must be a number or invalid request body
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: Category or new type id or new video game id not found
 *          409:
 *              description: Category already exists with new type id and/or new video game id
 *          500:
 *              description: Internal server error
 */
router.patch("/:typeId/:videoGameId", JWTMiddleWare.identification, Authorization.mustBeAdmin, CategoryController.updateCategory);

/**
 * @swagger
 * /category/{typeId}/{videoGameId}:
 *  delete:
 *      tags:
 *          - Category
 *      description: Delete a category
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: typeId
 *            description: The type id
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
 *              description: Id must be a number
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: Category not found
 *          500:
 *              description: Internal server error
 */
router.delete("/:typeId/:videoGameId", JWTMiddleWare.identification, Authorization.mustBeAdmin, CategoryController.deleteCategory);

module.exports = router;