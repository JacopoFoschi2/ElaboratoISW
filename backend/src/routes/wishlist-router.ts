import { Router } from 'express';
import * as wishlistController from '../controllers/wishlist-controller';

const router: Router = Router();

router.post('/api/wishlist/:userId/:gameId', wishlistController.addToWishlist);
router.get('/api/wishlist/:userId', wishlistController.listWishlistOfUser);
router.get('/api/wishlist/:userId/:gameId', wishlistController.isGameInWishlist);
router.delete('/api/wishlist/:userId/:gameId', wishlistController.deleteFromWishlist);

export default router;