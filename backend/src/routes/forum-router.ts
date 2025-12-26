import { Router } from "express";
import * as forumController from "../controllers/forum-controller";

const router: Router = Router();

router.post('/api/forums/game/:gameName/comment', forumController.addComment);
router.get('/api/forums', forumController.listForums);
router.get('/api/forums/game/:gameName/comments', forumController.listCommentsOfGame);
router.put('/api/forums/game/:gameName/comment/:commentId', forumController.updateComment);
router.delete('/api/forums/game/:gameName/comment/:commentId', forumController.deleteComment);

export default router;