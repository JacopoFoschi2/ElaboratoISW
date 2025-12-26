import { Router } from "express";
import * as categoriesController from "../controllers/categories-controller";

const router: Router = Router();

router.post("/categories", categoriesController.createCategory);
router.get("/categories", categoriesController.listCategories);
router.put("/categories/:id", categoriesController.updateCategory);
router.delete("/categories/:id", categoriesController.deleteCategory);

export default router;