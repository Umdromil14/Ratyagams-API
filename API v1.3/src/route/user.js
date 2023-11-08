const UserController = require('../controller/user');
const Identification = require('../middleware/identification');
const Autorisation = require('../middleware/autorization');

const Router = require("express-promise-router");
const router = new Router();


router.get('/login', UserController.login);
router.post('/', UserController.postUser);// pas de middleware car pas de token vu que pas de compte
router.delete('/:userId',Identification.identification,Autorisation.autorization,UserController.deleteUserFromAdmin);
router.patch('/:userId',Identification.identification,Autorisation.autorization ,UserController.updateUserFromAdmin);
router.delete('/',Identification.identification,UserController.deleteMyAccount);
router.patch('/',Identification.identification,UserController.updateMyAccount);
router.post('/insertWithGames',UserController.postUserWithGames);
router.get('/',UserController.getUsers);
router.get('/:userId',UserController.getUserFromId);


module.exports = router;