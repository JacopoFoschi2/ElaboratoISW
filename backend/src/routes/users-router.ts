import { Router } from 'express';
import * as usersController from '../controllers/users-controller';

const router: Router = Router();

router.post('/api/users', usersController.createUser);
router.get('/api/users', usersController.listUsers);
router.put('/api/users/:userId', usersController.updateUser);
router.delete('/api/users/:userId', usersController.deleteUser);
router.get('/api/users/exists/username/:username', usersController.isUsernameTaken);
router.get('/api/users/exists/email/:email', usersController.isEmailRegistered);

export default router;