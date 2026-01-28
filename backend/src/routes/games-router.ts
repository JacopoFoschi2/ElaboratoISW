import { Router } from 'express';
import * as gamesController from '../controllers/games-controller';
import { upload } from '../middleware/upload';

const router: Router = Router();

router.post(
    '/api/games',
    upload.fields([
        { name: 'gameSmallBanner', maxCount: 1 },
        { name: 'gameBigBanner', maxCount: 1 },
        { name: 'gameCover', maxCount: 1 },
    ]),
    gamesController.createGame
);

router.get('/api/games/rating', gamesController.listGamesOrderedByRating);
router.get('/api/games/release', gamesController.listGamesOrderedByRelease);
router.get('/api/games/:genreId', gamesController.listGamesOfGenre);
router.get('/api/games/as-you-type/:partialName', gamesController.listGamesAsYouType);
router.get('/api/games/matching/:partialName', gamesController.listGamesMatching);
router.get('/api/game/:gameId', gamesController.getGame);
router.get('/api/game/all/:gameId', gamesController.getCompleteGame);

router.put(
    '/api/games/:gameId',
    upload.fields([
        { name: 'gameSmallBanner', maxCount: 1 },
        { name: 'gameBigBanner', maxCount: 1 },
        { name: 'gameCover', maxCount: 1 },
    ]),
    gamesController.updateGame
);
router.delete('/api/games/:gameId', gamesController.deleteGame);

export default router;