import { Router } from "express";
import * as gameCategoriesController from "../controllers/game-categories-controller";

const router: Router = Router();

router.post("/api/game-categories", gameCategoriesController.addCategoryToGame);
router.get("/api/game-categories/:gameId", gameCategoriesController.listCategoriesOfGame);
router.put("/api/game-categories", gameCategoriesController.updateCategoryOfGame);
router.delete("/api/game-categories/:gameId/:categoryId", gameCategoriesController.removeCategoryFromGame);

export default router;