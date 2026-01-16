import { Router } from 'express';
import * as ownedController from '../controllers/owned-controller';

const router: Router = Router();

router.post('/api/owned/:gameId', ownedController.addToOwned);
router.get('/api/owned', ownedController.listOwnedOfUser);
router.get('/api/owned/:gameId', ownedController.isOwned);
router.delete('/api/owned/:gameId', ownedController.deleteFromOwned);

export default router;