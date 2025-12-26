import { Router } from 'express';
import * as wishlistController from '../controllers/wishlist-controller';

const router: Router = Router();

router.get('/api/wishlist/:userId', wishlistController.allWishlistOfUser);
router.get('/api/wishlist/contains/:userId/:gameId', wishlistController.isGameInWishlist);
router.post('/api/wishlist/add/:userId/:gameId', wishlistController.addToWishlist);
router.delete('/api/wishlist/delete/:userId/:gameId', wishlistController.removeFromWishlist);

export default router;