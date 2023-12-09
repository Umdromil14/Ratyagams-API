const Authorization = require("../middleware/authorization");
const JWTMiddleWare = require("../middleware/identification");
const PublicationController = require('../controller/publication');
const Router = require("express-promise-router");
const router = Router();

/**
 * @swagger
 * /publication:
 *  post:
 *       tags:
 *           - Publication
 *       description: Creating a new publication
 *       security:
 *           - bearerAuth: []
 *       requestBody:
 *           $ref: '#/components/requestBodies/PublicationToAdd'
 *       responses:
 *           201:
 *               $ref: '#/components/responses/PublicationAdded'
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
router.post("/", JWTMiddleWare.identification, Authorization.mustBeAdmin, PublicationController.createPublication);

/**
 * @swagger
 * /publication:
 *  get:
 *      tags:
 *          - Publication
 *      description: Get one publication or more
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: publicationId
 *            description: The publication id
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
 *          - name: videoGameName
 *            description: The video game name
 *            in: query
 *            required: false
 *            schema:
 *              type: string
 *          - name: platformCode
 *            description: The platform code
 *            in: query
 *            required: false
 *            schema:
 *              type: string
 *          - name: getOwnGames
 *            description: Get the user's games
 *            in: query
 *            required: false
 *            schema:
 *              type: boolean
 *          - name: getLastGames
 *            description: Get the latest games
 *            in: query
 *            required: false
 *            schema:
 *              type: boolean
 *          - name: alphabetical
 *            description: Order the result alphabetically
 *            in: query
 *            required: false
 *            schema:
 *              type: boolean
 *          - name: page
 *            description: The page number
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *          - name: limit
 *            description: The limit of the result
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/PublicationFound'
 *          400:
 *              description: INVALID_INPUT or INVALID_JWT
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: RESOURCE_NOT_FOUND or JWT_DEPRECATED
 *          500:
 *              description: Internal server error
 */
router.get("/", JWTMiddleWare.identification, PublicationController.getPublication);

/**
 * @swagger
 * /publication/count:
 *  get:
 *      tags:
 *          - Publication
 *      description: Get number of publications
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: '#/components/responses/PublicationCount'
 *          400:
 *              description: INVALID_JWT
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: RESOURCE_NOT_FOUND or JWT_DEPRECATED
 *          500:
 *              description: Internal server error
 */
router.get("/count", JWTMiddleWare.identification, PublicationController.getPublicationCount);


/**
 * @swagger
 * /publication/{publicationId}:
 *  patch:
 *      tags:
 *          - Publication
 *      description: Update a publication
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: publicationId
 *            description: The publication id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      requestBody:
 *          $ref: '#/components/requestBodies/PublicationToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/PublicationUpdated'
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
router.patch("/:publicationId", JWTMiddleWare.identification, Authorization.mustBeAdmin, PublicationController.updatePublication);

/**
 * @swagger
 * /publication/{publicationId}:
 *  delete:
 *      tags:
 *          - Publication
 *      description: Delete a publication
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: publicationId
 *            description: The publication id
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/PublicationDeleted'
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
router.delete("/:publicationId", JWTMiddleWare.identification, Authorization.mustBeAdmin, PublicationController.deletePublication);

module.exports = router;