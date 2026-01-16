import { Router } from 'express';
import * as usersController from '../controllers/users-controller';

const router: Router = Router();

router.get('/api/users', usersController.listUsers);
router.get('/api/users', usersController.getUser);
router.put('/api/users', usersController.updateUserInfo);
router.delete('/api/users/:userId', usersController.deleteUser);

export default router;