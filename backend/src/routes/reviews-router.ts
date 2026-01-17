import { Router } from 'express';
import * as reviewsController from '../controllers/reviews-controller';

const router = Router();

router.post('/api/reviews/:gameId', reviewsController.createReview);
router.get('/api/reviews/game/:gameId', reviewsController.listReviewsOfGame);
router.get('/api/reviews/user/:gameId', reviewsController.getReviewOfUserForGame);
router.put('/api/reviews/:gameId', reviewsController.updateReview);
router.delete('/api/reviews/:gameId', reviewsController.deleteReview);

export default router;