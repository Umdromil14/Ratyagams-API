const VideoGameController = require("../controller/videoGame.js");
const Router = require("express-promise-router");
const router = new Router();

router.get("/", VideoGameController.getVideoGames);
router.get("/:id", VideoGameController.getVideoGame);
router.post("/", VideoGameController.postVideoGame);
router.patch("/:id", VideoGameController.updateVideoGame);
router.delete("/:id", VideoGameController.deleteVideoGame);


module.exports = router;