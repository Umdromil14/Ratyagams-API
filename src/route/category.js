const CategoryController = require('../controller/category');
const Router = require("express-promise-router");
const router = new Router();

router.post("/", CategoryController.createCategory);
router.delete("/:typeId/:videoGameId", CategoryController.deleteCategory);
router.delete("/:typeId", CategoryController.deleteCategoriesFromType);
router.delete("//:videoGameId", CategoryController.deleteCategoriesFromVideoGame);
router.patch("/", CategoryController.updateCategory);
router.get("/", CategoryController.getCategories);
router.get("/:typeId/:videoGameId", CategoryController.getCategory);
router.get("/:typeId", CategoryController.getCategoriesFromType);
router.get("//:videoGameId", CategoryController.getCategoriesFromVideoGame);

module.exports = router;
