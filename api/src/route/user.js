const UserControleur = require('../controller/user');
const Identification = require('../middleware/identification');
const Autorisation = require('../middleware/autorization');

const Router = require("express-promise-router");
const router = new Router();


router.get('/login', UserControleur.login);
router.post('/', UserControleur.postUser);// pas de middleware car pas de token vu que pas de compte
router.delete('/:userId',Identification.identification,Autorisation.autorization,UserControleur.deleteUserAdmin);
router.patch('/:userId',Identification.identification,Autorisation.autorization ,UserControleur.updateUserAdmin);
router.delete('/',Identification.identification,UserControleur.deleteMyAccount);
router.patch('/',Identification.identification,UserControleur.updateMyAccount);
router.post('/insertWithGames',UserControleur.postUserWithGames);
router.get('/',UserControleur.getUsers);
router.get('/:userId',UserControleur.getUserById);


module.exports = router;