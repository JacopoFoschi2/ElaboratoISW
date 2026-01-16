import { Router } from 'express';
import * as usersController from '../controllers/users-controller';

const router: Router = Router();

router.get('/api/users', usersController.listUsers);
router.get('/api/user', usersController.getUser);
router.put('/api/user', usersController.updateUserInfo);
router.delete('/api/user/:userId', usersController.deleteUser);

export default router;