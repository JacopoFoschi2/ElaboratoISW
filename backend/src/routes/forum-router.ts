import { Router } from "express";
import * as forumController from "../controllers/forum-controller";

const router: Router = Router();

router.get('/api/forums', forumController.allForums);
router.get('/api/forums/game/:gameName/comments', forumController.allCommentsOfGame);
router.post('/api/forums/game/:gameName/comment', forumController.addComment);
router.put('/api/forums/game/:gameName/comment/:commentId', forumController.modifyComment);
router.delete('/api/forums/game/:gameName/comment/:commentId', forumController.removeComment);

export default router;