/**
 * @swagger
 * /user/login:
 * post:
 *     tags:
 *         - User
 *     description: Send a jwt token back if the user exist
 *     requestBody:
 *         $ref: '#/components/requestBodies/Login'
 *         content :
 *             application/json:
 *                 schema:
 *                     $ref : '#/components/schemas/Login'
 *     responses:
 *         200: 
 *              $ref: '#/components/responses/Login'           
 *         404 :
 *           description: User not found
 *         400 : 
 *           description: Bad request
 *         500 :
 *           description: Internal server error
 */


/**
 * @swagger
 * /user/{userId}:
 *  delete:
 *      tags:
 *          - User
 *      description: delete an user with the admin account
 *      security:
 *          - bearerAuth: []
 *      requestBody: 
 *          $ref: '#/components/requestBodies/deleteUserAdmin'
 *      parameters:
 *          - name: userId
 *            description: id of the user to delete
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses : 
 *          204:
 *            description: user deleted
 *          400:
 *            description: Id must be an Number
 *          403:
 *            description: can't delete an admin account and must be an admin account
 *          404:
 *            description: user not found
 *          500:
 *            description: Internal server error
 */
/**
 * @swagger
 * /user/{userId}:
 *  patch:
 *      tags:
 *          - User
 *      description: update an user with the admin account
 *      security:
 *          - bearerAuth: []
 *      requestBody: 
 *          description : Number and User object
 *      parameters:
 *          - name: userId
 *            description: id of the user to delete
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses : 
 *          204:
 *            description: user updated
 *          400:
 *            description: Id must be an Number or some fields are missing
 *          403:
 *            description: must be an admin account
 *          404:
 *            description: user not found
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
 *      description: delete his own account
 *      requestBody: 
 *          $ref: '#/components/requestBodies/deleteMyAccount'
 *      responses : 
 *          204:
 *            description: user deleted
 *          500:
 *            description: Internal server error
 */

/**
 * @swagger
 * /user/:
 *  patch:
 *      tags:
 *          - User
 *      description: update his own account
 *      requestBody: 
 *          $ref: '#/components/requestBodies/updateMyAccount'
 *      responses : 
 *          204:
 *            description: user updated
 *          400:
 *            description: Wrong email format or some fields are missing
 *          409: 
 *            description: Email or username already exist
 *          500:
 *            description: Internal server error
 */

/**
 * @swagger
 * /user/inserWithGames:
 *  post:
 *      tags:
 *          - User
 *      description: Create a user with games
 *      requestBody: 
 *          $ref: '#/components/requestBodies/createUserWithGames'
 *      responses : 
 *          201:
 *            description: user created with games
 *          400:
 *            description: Wrong email format
 *          404:
 *            description: some fields are missing
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
 *      description: get all users
 *      responses : 
 *          202:
 *            description: users found
 *          500:
 *            description: Internal server error
 */
/**
 * @swagger
 * /user/{userId}:
 *  get:
 *      tags:
 *          - User
 *      description: get a specific user
 *      requestBody: 
 *          description : Number id
 *      parameters:
 *          - name: userId
 *            description: id of the user
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses : 
 *          202:
 *            description: users found
 *          500:
 *            description: Internal server error
 */

//! still need to do the swagger for the post user
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