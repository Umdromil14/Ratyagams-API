const PublicationController = require('../controller/publication');
const Router = require("express-promise-router");
const router = Router();

router.get("/", PublicationController.getPublications);
router.get("/:id", PublicationController.getPublication);
router.post("/", PublicationController.createPublication);
router.patch("/", PublicationController.updatePublication);
router.delete("/:id", PublicationController.deletePublication);

module.exports = router;