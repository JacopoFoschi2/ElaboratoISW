import { Router } from "express";
import * as forumController from "../controllers/forum-controller";

const router: Router = Router();

router.get('/api/forums', forumController.allForums);
router.get('/api/forums/game/:gameId/comments', forumController.allCommentsOfGame);
router.post('/api/forums/game/:gameId/comment', forumController.addComment);
router.put('/api/forums/game/:gameId/comment/:commentId', forumController.modifyComment);
router.delete('/api/forums/game/:gameId/comment/:commentId', forumController.removeComment);

export default router;