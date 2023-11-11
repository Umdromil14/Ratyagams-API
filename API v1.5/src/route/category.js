const CategoryController = require('../controller/category');
const Router = require("express-promise-router");
const router = new Router();

router.post("/", CategoryController.createCategory);
router.delete("/:typeId/:videoGameId", CategoryController.deleteCategory);
router.delete("/:typeId", CategoryController.deleteCategoriesFromType); // ! à retirer car seulement utilisé dans les controllers
router.delete("//:videoGameId", CategoryController.deleteCategoriesFromVideoGame); // ! à retirer car seulement utilisé dans les controllers
router.patch("/:typeId/:videoGameId", CategoryController.updateCategory);
router.get("/", CategoryController.goToGet);

module.exports = router;
