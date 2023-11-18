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
 *          400 : 
 *              description: Invalid request body
 *          401 :
 *              description: Wrong password or username/email
 *          500 :
 *              description: Internal server error
 */

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
 *              description: Invalid request body
 *          409:
 *              description: Email or username already exist
 *          500:
 *              description: Internal server error
 */

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
 *              description: Id must be an Number or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              description: Must be an admin to access this route or can't delete an admin account
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal server error
 */

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
 *              description: Id must be an Number or invalid request body or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: User not found
 *          409:
 *              description: Email or username already exist
 *          500:
 *              description: Internal server error
 */

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
 *              description: Can't delete an admin account
 *          500:
 *              description: Internal server error
 */

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
 *              $ref: '#/components/responses/UserAndTokenUpdated'
 *          400:
 *              description: Invalid request body or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          409: 
 *              description: Email or username already exist
 *          500:
 *              description: Internal server error
 */

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
 *              description: Invalid request body or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          409:
 *              description: Email or username already exist
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /user:
 *  get:
 *      tags:
 *          - User
 *      description: Get all users
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
 *              description: No user found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /user/{userId}:
 *  get:
 *      tags:
 *          - User
 *      description: Get a specific user
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: userId
 *            description: Id of the user
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses : 
 *          200:
 *              $ref: '#/components/responses/UserFound'
 *          400:
 *              description: Id must be an Number or invalid JWT token
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              description: No user found
 *          500:
 *              description: Internal server error
 */

const UserController = require('../controller/user');
const AuthoMiddleware = require('../middleware/Authorization');
const JWTMiddleWare = require('../middleware/Identification');

const Router = require("express-promise-router");
const router = new Router();

router.post('/login', UserController.login);
router.post('/', UserController.postUser);//! pas de middleware car pas de token vu que pas de compte
router.delete('/:userId', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, UserController.deleteUserFromAdmin);
router.patch('/:userId', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, UserController.updateUserFromAdmin);
router.delete('/', JWTMiddleWare.identification, UserController.deleteMyAccount);
router.patch('/', JWTMiddleWare.identification, UserController.updateMyAccount);
router.post('/insertWithGames', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, UserController.postUserWithGames);
// router.get()
router.get('/', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, UserController.getAllUsers);
router.get('/:userId', JWTMiddleWare.identification, AuthoMiddleware.mustBeAdmin, UserController.getUser);
router.get('/me', JWTMiddleWare.identification, UserController.getUserFromToken);

module.exports = router;