import { Router } from 'express';
import * as gamesController from '../controllers/games-controller.js';

const router: Router = Router();

router.get('/api/games', gamesController.allGames);

export default router;