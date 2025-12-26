import { Router } from 'express';
import * as reviewsController from '../controllers/reviews-controller';

const router = Router();

router.post('/api/reviews/game/:gameName/user/:userId', reviewsController.createReview);
router.get('/api/reviews/game/:id', reviewsController.listReviewsOfGame);
router.get('/api/reviews/user/:id', reviewsController.listReviewsOfUser);
router.put('/api/reviews/game/:gameName/user/:userId', reviewsController.updateReview);
router.delete('/api/reviews/game/:gameName/user/:userId', reviewsController.deleteReview);

export default router;