import { Router } from 'express';
import * as wishlistController from '../controllers/wishlist-controller';

const router: Router = Router();

router.post('/api/wishlist/:gameId', wishlistController.addToWishlist);
router.get('/api/wishlist', wishlistController.listWishlistOfUser);
router.delete('/api/wishlist/:gameId', wishlistController.deleteFromWishlist);
router.get('/api/wishlist/:gameId', wishlistController.isGameInWishlist);

export default router;