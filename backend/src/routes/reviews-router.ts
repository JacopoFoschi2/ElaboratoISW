import { Router } from 'express';
import * as reviewsController from '../controllers/reviews-controller';

const router = Router();

router.post('/api/reviews/:gameId/:userId', reviewsController.createReview);
router.get('/api/reviews/game/:gameId', reviewsController.listReviewsOfGame);
router.get('/api/reviews/user/:userId', reviewsController.listReviewsOfUser);
router.put('/api/reviews/:gameId/:userId', reviewsController.updateReview);
router.delete('/api/reviews/:gameId/:userId', reviewsController.deleteReview);

export default router;