import { Router } from 'express';
import * as gamesController from '../controllers/games-controller';

const router: Router = Router();

router.get('/api/games/:genreId', gamesController.allGamesOfGenre);
router.get('/api/games/rating', gamesController.allGamesOrderedByRating);
router.get('/api/games/release', gamesController.allGamesOrderedByRelease);
router.post('/api/game/add', gamesController.addGame);
router.delete('/api/game/delete/:gameName', gamesController.removeGame);
router.put('/api/game/modify/:gameName', gamesController.modifyGame);
router.get('/api/wishlist/:userId', gamesController.allWishlistOfUser);
router.get('/api/wishlist/contains/:userId/:gameId', gamesController.isGameInWishlist);
router.post('/api/wishlist/add/:userId/:gameId', gamesController.addToWishlist);
router.delete('/api/wishlist/delete/:userId/:gameId', gamesController.removeFromWishlist);

export default router;