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

/**
 * @swagger
 * /type:
 *  get:
 *      tags:
 *          - Type
 *      description: Get all types
 *      responses:
 *          200:
 *              $ref: '#/components/responses/TypesFound'
 *          404:
 *              description: No type found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /type/{id}:
 *  get:
 *      tags:
 *          - Type
 *      description: Get a type
 *      parameters:
 *          - name: id
 *            description: The type id
 *            in: path
 *            required: true
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

const TypeController = require('../controller/type');
const Authorization = require("../middleware/authorization");
const JWTMiddleWare = require("../middleware/identification");
const Router = require("express-promise-router");
const router = new Router();


router.post("/",JWTMiddleWare.identification, Authorization.mustBeAdmin, TypeController.createType);
router.delete("/:id", JWTMiddleWare.identification, Authorization.mustBeAdmin, TypeController.deleteType);
router.patch("/:id", JWTMiddleWare.identification, Authorization.mustBeAdmin, TypeController.updateType);
router.get("/all", TypeController.getTypes);
router.get("/:id", TypeController.getType);


module.exports = router;