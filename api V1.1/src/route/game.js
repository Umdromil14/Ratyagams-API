const GameController = require("../controller/game");
const Router = require("express-promise-router");
const router = Router();

router.get("/:userId", GameController.getUserGames);
router.get("/:userId/:publicationId", GameController.getGame);
router.post("/", GameController.postGame);
router.patch("/", GameController.updateGame);
router.delete("/:userId", GameController.deleteGamesByUser);
router.delete("/", GameController.deleteGame);

module.exports = router;