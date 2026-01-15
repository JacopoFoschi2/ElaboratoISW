import { Router } from 'express';
import * as gamesController from '../controllers/games-controller';

const router: Router = Router();

router.post('/api/games', gamesController.createGame);
router.get('/api/games/rating', gamesController.listGamesOrderedByRating);
router.get('/api/games/release', gamesController.listGamesOrderedByRelease);
router.get('/api/games/:genreId', gamesController.listGamesOfGenre);
router.get('/api/game/:gameId', gamesController.getGame);
router.put('/api/games/:gameId', gamesController.updateGame);
router.delete('/api/games/:gameId', gamesController.deleteGame);

export default router;