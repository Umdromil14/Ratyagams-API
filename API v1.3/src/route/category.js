const CategoryController = require('../controller/category');
const Router = require("express-promise-router");
const router = new Router();

router.post("/", CategoryController.createCategory);
router.delete("/:typeId/:videoGameId", CategoryController.deleteCategory);
router.delete("/:typeId", CategoryController.deleteCategoriesFromType); // ! à retirer car seulement utilisé dans les controllers
router.delete("//:videoGameId", CategoryController.deleteCategoriesFromVideoGame); // ! à retirer car seulement utilisé dans les controllers
router.patch("/", CategoryController.updateCategory);
router.get("/", CategoryController.getAllCategories);
router.get("/:typeId/:videoGameId", CategoryController.getCategory);
router.get("/:typeId", CategoryController.getCategoriesFromType);
router.get("//:videoGameId", CategoryController.getCategoriesFromVideoGame); // TODO changer le // par un url query

module.exports = router;
