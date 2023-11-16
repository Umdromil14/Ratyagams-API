/**
 * @swagger
 * /platform:
 *  get:
 *      tags:
 *          - Platform
 *      description: Get all platforms
 *      responses:
 *          200:
 *              $ref: '#/components/responses/PlatformsFound'
 *          404:
 *              description: No platform found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /platform/{code}:
 *  get:
 *      tags:
 *          - Platform
 *      description: Get a platform by its code
 *      parameters:
 *          - name: code
 *            description: The code of the platform (will be converted to uppercase)
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              $ref: '#/components/responses/PlatformFound'
 *          404:
 *              description: No platform found
 *          500:
 *              description: Internal server error
 */

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
 *              description: Invalid request body or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          409:
 *              description: Platform already exists
 *          500:
 *              description: Internal server error
 */

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
 *              description: Invalid request body or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          409:
 *              description: Platform already exists
 *          500:
 *              description: Internal server error
 */

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
 *              description: Invalid request body or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: Platform not found
 *          409:
 *              description: Platform already exists with new code
 *          500:
 *              description: Internal server error
 */

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
 *              description: Platform not found
 *          500:
 *              description: Internal server error
 */

const AuthoMiddleware = require('../middleware/Authorization');
const JWTMiddleWare = require('../middleware/Identification');
const PlatformController = require('../controller/platform');
const Router = require("express-promise-router");
const router = new Router();

router.get('/', PlatformController.getAllPlatforms);
router.get('/:code', PlatformController.getPlatform);
router.post('/', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, PlatformController.postPlatform);
router.post('/withVideoGames', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, PlatformController.postPlatformWithNewVideoGames);
router.patch('/:code', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, PlatformController.updatePlatform);
router.delete('/:code', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, PlatformController.deletePlatform);

module.exports = router;