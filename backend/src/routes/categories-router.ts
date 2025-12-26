import { Router } from "express";
import * as categoriesController from "../controllers/categories-controller";

const router: Router = Router();

router.get("/categories", categoriesController.allCategories);
router.post("/categories", categoriesController.addCategory);
router.delete("/categories/:id", categoriesController.deleteCategory);
router.put("/categories/:id", categoriesController.modifyCategory);

export default router;