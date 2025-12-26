import { Router } from 'express';
import * as ownedController from '../controllers/owned-controller';

const router: Router = Router();

router.post('/api/owned/add/:userId/:gameId', ownedController.addToOwned);
router.get('/api/owned/:userId', ownedController.listOwnedOfUser);
router.delete('/api/owned/delete/:userId/:gameId', ownedController.deleteFromOwned);
router.get('/api/owned/contains/:userId/:gameId', ownedController.isOwned);

export default router;