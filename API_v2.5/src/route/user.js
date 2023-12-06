const UserController = require('../controller/user');
const AuthoMiddleware = require('../middleware/Authorization');
const JWTMiddleWare = require('../middleware/Identification');
const Router = require("express-promise-router");
const router = new Router();

/**
 * @swagger  
 * /user/login:
 *  post:
 *      tags:
 *          - User
 *      description: Connect an user with his email or password and return a token
 *      requestBody:
 *          $ref: '#/components/requestBodies/Login'
 *      responses:
 *          200: 
 *              $ref: '#/components/responses/LoginSuccess'         
 *          400: 
 *              description: INVALID_INPUT
 *          401:
 *              description: WRONG_CREDENTIALS
 *          500:
 *              description: Internal server error
 */
router.post('/login', UserController.login);

/**
 * @swagger
 * /user:
 *  post:
 *      tags:
 *          - User
 *      description: Create a user
 *      requestBody: 
 *          $ref: '#/components/requestBodies/UserToAdd'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/UserAdded'
 *          400:
 *              description: INVALID_INPUT
 *          409:
 *              description: DUPLICATE_ENTRY
 *          500:
 *              description: Internal server error
 */
router.post('/', UserController.postUser);

/**
 * @swagger
 * /user/insertWithGames:
 *  post:
 *      tags:
 *          - User
 *      description: Create a user with games
 *      security:
 *          - bearerAuth: []
 *      requestBody: 
 *          $ref: '#/components/requestBodies/UserToAddWithGames'
 *      responses: 
 *          201:
 *              $ref: '#/components/responses/UserAddedWithGames'
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
router.post('/insertWithGames', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, UserController.postUserWithGames);

/**
 * @swagger
 * /user/me:
 *  get:
 *      tags:
 *          - User
 *      description: Get a specific user from his token
 *      security:
 *          - bearerAuth: []
 *      responses : 
 *          200:
 *              $ref: '#/components/responses/UserFound'
 *          400:
 *              description: INVALID_JWT
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              $ref: '#/components/responses/DeprecatedJWT'
 *          500:
 *              description: Internal server error
 */
router.get('/me', JWTMiddleWare.identification, UserController.getUserFromToken);

/**
 * @swagger
 * /user:
 *  get:
 *      tags:
 *          - User
 *      description: Get one or all users
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: '#/components/responses/UsersFound'
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
router.get('/', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, UserController.getUser);


/**
 * @swagger
 * /user/pagination/:
 *  get:
 *      tags:
 *          - User
 *      description: Get a certain number of users
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
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: '#/components/responses/UsersFound'
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
router.get('/pagination', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, UserController.getUserPagination);

/**
 * @swagger
 * /user/{userId}:
 *  patch:
 *      tags:
 *          - User
 *      description: Update one user with an admin account
 *      security:
 *          - bearerAuth: []
 *      requestBody: 
 *          $ref: '#/components/requestBodies/UserToUpdateFromAdmin'
 *      parameters:
 *          - name: userId
 *            description: Id of the user to update
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses : 
 *          204:
 *              $ref: '#/components/responses/UserUpdated'
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
router.patch('/:userId', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, UserController.updateUserFromAdmin);

/**
 * @swagger
 * /user:
 *  patch:
 *      tags:
 *          - User
 *      description: Update his own account
 *      security:
 *          - bearerAuth: []
 *      requestBody: 
 *          $ref: '#/components/requestBodies/UserToUpdateFromToken'
 *      responses:
 *          200:
 *              $ref: '#/components/responses/UserUpdated'
 *          400:
 *              description: INVALID_INPUT or INVALID_JWT
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          409: 
 *              description: DUPLICATE_ENTRY
 *          500:
 *              description: Internal server error
 */
router.patch('/', JWTMiddleWare.identification, UserController.updateMyAccount);

/**
 * @swagger
 * /user/{userId}:
 *  delete:
 *      tags:
 *          - User
 *      description: Delete a user with an admin account
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: userId
 *            description: The id of the user to delete
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/UserDeleted'
 *          400:
 *              description: INVALID_INPUT or INVALID_JWT
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              description: AUTH_LEVEL_NOT_SUFFICIENT or DELETE_FORBIDDEN
 *          404:
 *              description: RESOURCE_NOT_FOUND or JWT_DEPRECATED
 *          500:
 *              description: Internal server error
 */
router.delete('/:userId', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, UserController.deleteUserFromAdmin);

/**
 * @swagger
 * /user:
 *  delete:
 *      tags:
 *          - User
 *      description: Delete his own account
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          204:
 *              $ref: '#/components/responses/UserDeleted'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              description: DELETE_FORBIDDEN
 *          404:
 *              $ref: '#/components/responses/DeprecatedJWT'
 *          500:
 *              description: Internal server error
 */
router.delete('/', JWTMiddleWare.identification, UserController.deleteMyAccount);

module.exports = router;