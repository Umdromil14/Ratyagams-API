/**
 * @swagger  
 * /user/login:
 *  post:
 *      tags:
 *          - User
 *      description: Connect an user with his email and password and return a token
 *      requestBody:
 *          $ref: '#/components/requestBodies/Login'
 *      responses:
 *          200: 
 *            description: The user is connected and a token is created          
 *          404 :
 *            description: The user is not found
 *          400 : 
 *            description: The email/password is not correct or some fields are missing
 *          500 :
 *            description: Internal server error
 */
/**
 * @swagger
 * /user/{userId}:
 *  delete:
 *      tags:
 *          - User
 *      description: Delete one user with an admin account
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: userId
 *            description: Id of the user the admin want to delete
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses : 
 *          204:
 *            description: User deleted
 *          400:
 *            description: Id must be an Number
 *          403:
 *            description: Can't delete an admin account and must be an admin account
 *          404:
 *            description: User not found
 *          500:
 *            description: Internal server error
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
 *          $ref: '#/components/requestBodies/updateUserFromAdmin'
 *      parameters:
 *          - name: userId
 *            description: Id of the user to update
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses : 
 *          204:
 *            description: User updated
 *          400:
 *            description: Id must be an Number or some fields are missing
 *          403:
 *            description: Must be an admin account
 *          404:
 *            description: User not found
 *          409:
 *            description: Email or username already exist
 *          500:
 *            description: Internal server error
 */

/**
 * @swagger
 * /user/:
 *  delete:
 *      tags:
 *          - User
 *      description: Delete his own account
 *      responses : 
 *          204:
 *            description: User deleted
 *          403:
 *            description: Can't delete an admin account
 *          500:
 *            description: Internal server error
 */

/**
 * @swagger
 * /user/:
 *  patch:
 *      tags:
 *          - User
 *      description: Update his own account
 *      requestBody: 
 *          $ref: '#/components/requestBodies/updateMyAccount'
 *      responses : 
 *          204:
 *            description: User updated
 *          400:
 *            description: Wrong email format or some fields are missing
 *          409: 
 *            description: Email or username already exist
 *          500:
 *            description: Internal server error
 */

/**
 * @swagger
 * /user/insertWithGames:
 *  post:
 *      tags:
 *          - User
 *      description: Create a user with games
 *      requestBody: 
 *          $ref: '#/components/requestBodies/insertUserWithGames'
 *      responses : 
 *          201:
 *            description: User created with games
 *          400:
 *            description: Wrong email format
 *          404:
 *            description: Some fields are missing
 *          409:
 *            description: Email or username already exist
 *          500:
 *            description: Internal server error
 */

/**
 * @swagger
 * /user/:
 *  get:
 *      tags:
 *          - User
 *      description: Get all users
 *      responses : 
 *          202:
 *            description: Users found
 *          500:
 *            description: Internal server error
 */
/**
 * @swagger
 * /user/{userId}:
 *  get:
 *      tags:
 *          - User
 *      description: Get a specific user
 *      parameters:
 *          - name: userId
 *            description: Id of the user
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses : 
 *          202:
 *            description: User found
 *          500:
 *            description: Internal server error
 */

/**
 * @swagger
 * /user/:
 *  post:
 *      tags:
 *          - User
 *      description: Create a user
 *      requestBody: 
 *          $ref: '#/components/requestBodies/createUser'
 *      responses : 
 *          201:
 *            description: User created
 *          400:
 *            description: Wrong email format
 *          404:
 *            description: Some fields are missing
 *          409:
 *            description: Email or username already exist
 *          500:
 *            description: Internal server error
 */

const UserController = require('../controller/user');
const Identification = require('../middleware/identification');
const Autorisation = require('../middleware/autorization');

const Router = require("express-promise-router");
const router = new Router();


router.post('/login', UserController.login);
router.post('/', UserController.postUser);// pas de middleware car pas de token vu que pas de compte
router.delete('/:userId',/*Identification.identification,Autorisation.autorization,*/UserController.deleteUserFromAdmin);
router.patch('/:userId',/*Identification.identification,Autorisation.autorization ,*/UserController.updateUserFromAdmin);
router.delete('/',Identification.identification,UserController.deleteMyAccount);
router.patch('/',Identification.identification,UserController.updateMyAccount);
router.post('/insertWithGames',UserController.postUserWithGames);
router.get('/',UserController.getUsers);
router.get('/:userId',UserController.getUser);


module.exports = router;