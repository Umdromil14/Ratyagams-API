const AuthoMiddleware = require('../middleware/Authorization');
const JWTMiddleWare = require('../middleware/Identification');
const PlatformController = require('../controller/platform');
const Router = require("express-promise-router");
const router = new Router();

/**
 * @swagger
 * /platform:
 *  get:
 *      tags:
 *          - Platform
 *      description: Get all platforms or a platform by its code
 *      parameters:
 *          - name: code
 *            description: The code of the platform (will be converted to uppercase)
 *            in: query
 *            required: false
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              $ref: '#/components/responses/PlatformsFound'
 *          404:
 *              description: RESOURCE_NOT_FOUND
 *          500:
 *              description: Internal server error
 */
router.get('/', PlatformController.getPlatform);

/**
 * @swagger
 * /platform/pagination:
 *  get:
 *      tags:
 *          - Platform
 *      description: get platforms with pagination
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
 *              $ref: '#/components/responses/PlatformsFound'
 *          404:
 *              description: RESOURCE_NOT_FOUND
 *          500:
 *              description: Internal server error
 */
router.get('/pagination', PlatformController.getPlatformsWithPagination);

/**
 * @swagger
 * /platform/count:
 *  get:
 *      tags:
 *          - Platform
 *      description: get the number of platforms
 *      responses:
 *          200:
 *              $ref: '#/components/responses/PlatformsCount'
 *          404:
 *              description: RESOURCE_NOT_FOUND
 *          500:
 *              description: Internal server error
 */
router.get('/count', PlatformController.getPlatformsCount);


/**
 * @swagger
 * /platform:
 *  post:
 *      tags:
 *          - Platform
 *      description: Create a new platform
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/PlatformToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/PlatformAdded'
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
router.post('/', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, PlatformController.addPlatform);

/**
 * @swagger
 * /platform/withVideoGames:
 *  post:
 *      tags:
 *          - Platform
 *      description: Create a new platform with new video games
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/PlatformToAddWithVideoGames'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/PlatformAddedWithVideoGames'
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
router.post('/withVideoGames', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, PlatformController.addPlatformWithNewVideoGames);

/**
 * @swagger
 * /platform/{code}:
 *  patch:
 *      tags:
 *          - Platform
 *      description: Update a platform
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: code
 *            description: The code of the platform (will be converted to uppercase)
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *          $ref: '#/components/requestBodies/PlatformToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/PlatformUpdated'
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
router.patch('/:code', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, PlatformController.updatePlatform);

/**
 * @swagger
 * /platform/{code}:
 *  delete:
 *      tags:
 *          - Platform
 *      description: Delete a platform
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: code
 *            description: The code of the platform (will be converted to uppercase)
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          204:
 *              $ref: '#/components/responses/PlatformDeleted'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: RESOURCE_NOT_FOUND or JWT_DEPRECATED
 *          500:
 *              description: Internal server error
 */
router.delete('/:code', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, PlatformController.deletePlatform);

module.exports = router;