const GameController = require("../controller/game");
const Router = require("express-promise-router");
const router = Router();

router.get("/:userId", GameController.getUserGames);
router.get("/:userId/:gameId", GameController.getGame);
router.post("/", GameController.postGame);
router.patch("/", GameController.updateGame);
router.delete("/:userId", GameController.deleteUserGames);
router.delete("/:userId/:gameId", GameController.deleteGame);

module.exports = router;