// TODO add security

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
 *            description: The code of the platform
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
 *      requestBody:
 *          $ref: '#/components/requestBodies/PlatformToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/PlatformAdded'
 *          400:
 *              description: Invalid request body
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
 *      parameters:
 *          - name: code
 *            description: The code of the platform
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
 *              description: Invalid request body
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
 *      parameters:
 *          - name: code
 *            description: The code of the platform
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          204:
 *              description: Platform deleted
 *          404:
 *              description: Platform not found
 *          500:
 *              description: Internal server error
 */

const PlatformController = require('../controller/platform');
const Router = require("express-promise-router");
const router = new Router();

router.get('/', PlatformController.getAllPlatforms);
router.get('/:code', PlatformController.getPlatform);
router.post('/', PlatformController.postPlatform);
router.patch('/:code', PlatformController.updatePlatform);
router.delete('/:code', PlatformController.deletePlatform);

module.exports = router;