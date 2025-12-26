import { Router } from 'express';
import * as wishlistController from '../controllers/wishlist-controller';

const router: Router = Router();

router.post('/api/wishlist/add/:userId/:gameId', wishlistController.addToWishlist);
router.get('/api/wishlist/:userId', wishlistController.listWishlistOfUser);
router.delete('/api/wishlist/delete/:userId/:gameId', wishlistController.deleteFromWishlist);
router.get('/api/wishlist/contains/:userId/:gameId', wishlistController.isGameInWishlist);

export default router;