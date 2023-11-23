const TypeController = require('../controller/type');
const Authorization = require("../middleware/authorization");
const JWTMiddleWare = require("../middleware/identification");
const Router = require("express-promise-router");
const router = new Router();

/**
 * @swagger
 * /type:
 *  post:
 *      tags:
 *          - Type
 *      description: Creating a new type
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/TypeToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/TypeAdded'
 *          400:
 *              description: Invalid request body or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          409:
 *              description: Type already exists
 *          500:
 *              description: Internal server error
 */
router.post("/",JWTMiddleWare.identification, Authorization.mustBeAdmin, TypeController.createType);

/**
 * @swagger
 * /type:
 *  get:
 *      tags:
 *          - Type
 *      description: Get a type
 *      parameters:
 *          - name: id
 *            description: The type id
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/TypeFound'
 *          404:
 *              description: No type found
 *          500:
 *              description: Internal server error
 */
router.get("/", TypeController.getTypes);

/**
 * @swagger
 * /type/{id}:
 *  patch:
 *      tags:
 *          - Type
 *      description: Update a type
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: id
 *            description: The type id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      requestBody:
 *          $ref: '#/components/requestBodies/TypeToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/TypeUpdated'
 *          400:
 *              description: Id must be a number and/or invalid request body and/or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: Type id not found
 *          409:
 *              description: Type already exists with new name
 *          500:
 *              description: Internal server error
 */
router.patch("/:id", JWTMiddleWare.identification, Authorization.mustBeAdmin, TypeController.updateType);

/**
 * @swagger
 * /type/{id}:
 *  delete:
 *      tags:
 *          - Type
 *      description: Delete a type
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: id
 *            description: The type id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/TypeDeleted'
 *          400:
 *              description: Id must be a number or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: Type not found
 *          500:
 *              description: Internal server error
 */
router.delete("/:id", JWTMiddleWare.identification, Authorization.mustBeAdmin, TypeController.deleteType);

module.exports = router;