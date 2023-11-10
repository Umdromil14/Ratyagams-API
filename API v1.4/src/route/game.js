const GameController = require("../controller/game");
const Router = require("express-promise-router");
const router = Router();

router.get("/", GameController.getAllGames);
router.get("/:userId", GameController.getUserGames);
router.get("/:userId/:publicationId", GameController.getGame);
router.post("/", GameController.postGame);
router.patch("/:userId/:publicationId", GameController.updateGame);
router.delete("/:userId/:publicationId", GameController.deleteGame);

module.exports = router;