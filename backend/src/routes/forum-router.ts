import { Router } from "express";
import * as forumController from "../controllers/forum-controller";

const router: Router = Router();

router.post('/api/games/:gameId/comments', forumController.addComment);
router.get('/api/forums', forumController.listForums);
router.get('/api/forums/as-you-type/:partialName', forumController.listForumsAsYouType);
router.get('/api/forums/matching/:partialName', forumController.listForumsMatching);
router.get('/api/games/:gameId/comments', forumController.listCommentsOfGame);
router.put('/api/comments/:commentId', forumController.updateComment);
router.delete('/api/comments/:commentId', forumController.deleteComment);

export default router;