import { Router } from 'express';
import * as usersController from '../controllers/users-controller';

const router: Router = Router();

router.post('/api/users', usersController.createUser);
router.get('/api/users', usersController.listUsers);
router.put('/api/users/:userId', usersController.updateUser);
router.delete('/api/users/:userId', usersController.deleteUser);

export default router;