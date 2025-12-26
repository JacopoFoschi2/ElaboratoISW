import { Router } from 'express';
import * as ownedController from '../controllers/owned-controller';

const router: Router = Router();

router.get('/api/owned/:userId', ownedController.allOwnedOfUser);
router.get('/api/owned/contains/:userId/:gameId', ownedController.checkIfOwned);
router.post('/api/owned/add/:userId/:gameId', ownedController.addToOwned);
router.delete('/api/owned/delete/:userId/:gameId', ownedController.removeFromOwned);

export default router;