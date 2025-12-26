import { Router } from 'express';
import * as ownedController from '../controllers/owned-controller';

const router: Router = Router();

router.post('/api/owned/:userId/:gameId', ownedController.addToOwned);
router.get('/api/owned/:userId', ownedController.listOwnedOfUser);
router.delete('/api/owned/:userId/:gameId', ownedController.deleteFromOwned);
router.get('/api/owned/:userId/:gameId', ownedController.isOwned);

export default router;