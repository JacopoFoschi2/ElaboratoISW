import { Router } from "express";
import * as categoriesController from "../controllers/categories-controller";

const router: Router = Router();

router.post("/api/categories", categoriesController.createCategory);
router.get("/api/categories", categoriesController.listCategories);
router.put("/api/categories/:categoryId", categoriesController.updateCategory);
router.delete("/api/categories/:categoryId", categoriesController.deleteCategory);

export default router;