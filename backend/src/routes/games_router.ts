import { Router } from 'express';
import * as gamesController from '../controllers/games-controller';

const router: Router = Router();

router.get('/api/games', gamesController.allGames);

export default router;