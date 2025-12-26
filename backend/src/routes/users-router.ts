import { Router } from 'express';
import * as usersController from '../controllers/users-controller';

const router: Router = Router();

router.post('/api/user/add', usersController.createNewUser);
router.get('/api/users', usersController.listUsersAndPrivileges);
router.put('/api/user/modify/:id', usersController.updateUser);
router.delete('/api/user/delete/:id', usersController.deleteUser);

export default router;