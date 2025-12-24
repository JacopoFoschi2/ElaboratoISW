import { Router } from 'express';
import * as reviewsController from '../controllers/reviews-controller';

const router = Router();

//TODO: Implement review routes
router.get('/api/reviews/game/:id', reviewsController.allReviewsOfGame);
router.get('/api/reviews/user/:id', reviewsController.reviewOfUser);
router.post('/api/reviews/game/:gameName/user/:userId', reviewsController.addReview);
router.put('/api/reviews/game/:gameName/user/:userId', reviewsController.modifyReview);
router.delete('/api/reviews/game/:gameName/user/:userId', reviewsController.removeReview);

export default router;