const PlatformController = require('../controller/platform');
const Router = require("express-promise-router");
const router = new Router();

router.get('/', PlatformController.getAllPlatforms);
router.get('/:code', PlatformController.getPlatform);
router.post('/', PlatformController.postPlatform);
router.patch('/', PlatformController.updatePlatform);
router.delete('/:code', PlatformController.deletePlatform);

module.exports = router;