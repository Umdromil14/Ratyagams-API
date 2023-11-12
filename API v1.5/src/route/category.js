/**
 * @swagger
 * /category:
 *  post:
 *       tags:
 *           - Category
 *       description: Creating a new category
 *       requestBody:
 *           $ref: '#/components/requestBodies/CategoryToAdd'
 *       responses:
 *           201:
 *               $ref: '#/components/responses/CategoryAdded'
 *           400:
 *               description: Invalid request body
 *           404:
 *               description: Type id or video game id not found
 *           409:
 *               description: Category already exists
 *           500:
 *               description: Internal server error
 */

/**
 * @swagger
 * /category/{typeId}/{videoGameId}:
 *  delete:
 *      tags:
 *          - Category
 *      description: Delete a category
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
 *          404:
 *              description: Category not found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /category/{typeId}/{videoGameId}:
 *  patch:
 *      tags:
 *          - Category
 *      description: Update a category
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
 *          404:
 *              description: Category or new type id or new video game id not found
 *          409:
 *              description: Category already exists with new type id and/or new video game id
 *          500:
 *              description: Internal server error
 */

// /**
//  * @swagger
//  * /category:
//  *  get:
//  *      tags:
//  *          - Category
//  *      description: Get a category or all categories from a type or from a video game or just all the category
//  *      parameters:
//  *          - name: typeId
//  *            description: The type id
//  *            in: query
//  *            required: false
//  *            schema:
//  *              type: integer
//  *          - name: videoGameId
//  *            description: The video game id
//  *            in: query
//  *            required: false
//  *            schema:
//  *              type: integer
//  *      responses:
//  *          200:
//  *              description: Category(ies) was(were) found
//  *              content:
//  *                  application/json:
//  *                      schema:
//  *                          oneOf:
//  *                              - $ref: '#/components/responses/CategoriesFound'
//  *                              - $ref: '#/components/responses/CategoryFound'
//  *          404:
//  *              description: No category found
//  *          500:
//  *              description: Internal server error
//  */

/**
 * @swagger
 * /category:
 *  get:
 *      tags:
 *          - Category
 *      description: Get a category or all categories from a type or from a video game or just all the category
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
 *          404:
 *              description: No category found
 *          500:
 *              description: Internal server error
 */

const CategoryController = require('../controller/category');
const Router = require("express-promise-router");
const router = new Router();

router.post("/", CategoryController.createCategory);
router.delete("/:typeId/:videoGameId", CategoryController.deleteCategory);
// router.delete("/:typeId", CategoryController.deleteCategoriesFromType); // ! à retirer car seulement utilisé dans les controllers
// router.delete("//:videoGameId", CategoryController.deleteCategoriesFromVideoGame); // ! à retirer car seulement utilisé dans les controllers
router.patch("/:typeId/:videoGameId", CategoryController.updateCategory);
router.get("/", CategoryController.goToGet);

module.exports = router;
