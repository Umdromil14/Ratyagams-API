const TypeController = require('../controller/type');

const Router = require("express-promise-router");
const router = new Router();


router.post("/", TypeController.createType);
router.delete("/:id", TypeController.deleteType);
router.patch("/", TypeController.updateType);
router.get("/", TypeController.getTypes);
router.get("/:id", TypeController.getType);


module.exports = router;