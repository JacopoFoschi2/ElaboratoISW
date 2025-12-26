import { Router } from 'express';
import * as gamesController from '../controllers/games-controller';

const router: Router = Router();

router.post('/api/game/add', gamesController.createGame);
router.get('/api/games/:genreId', gamesController.listGamesOfGenre);
router.get('/api/games/rating', gamesController.listGamesOrderedByRating);
router.get('/api/games/release', gamesController.listGamesOrderedByRelease);
router.put('/api/game/modify/:gameName', gamesController.updateGame);
router.delete('/api/game/delete/:gameName', gamesController.deleteGame);

export default router;