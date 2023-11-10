const CategoryController = require('../controller/category');
const Router = require("express-promise-router");
const router = new Router();

router.post("/", CategoryController.createCategory);
router.delete("/:typeId/:videoGameId", CategoryController.deleteCategory);
router.delete("/:typeId", CategoryController.deleteCategoriesFromType); // ! à retirer car seulement utilisé dans les controllers
router.delete("//:videoGameId", CategoryController.deleteCategoriesFromVideoGame); // ! à retirer car seulement utilisé dans les controllers
router.patch("/:typeId/:videoGameId", CategoryController.updateCategory);
router.get("/", CategoryController.goToGet);
// router.get("/", CategoryController.getAllCategories);
// router.get("/:typeId/:videoGameId", CategoryController.getCategory);
// router.get("/:typeId", CategoryController.getCategoriesFromType);
// router.get("/", CategoryController.getCategoriesFromVideoGame); // TODO changer le // par un url query

module.exports = router;
