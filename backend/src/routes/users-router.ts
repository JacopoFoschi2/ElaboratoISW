import { Router } from 'express';
import * as usersController from '../controllers/users-controller';

const router: Router = Router();

router.get('/api/users', usersController.allUsersAndPrivileges);
router.put('/api/user/modify/:id', usersController.modifyUser);
router.delete('/api/user/delete/:id', usersController.removeUser);
router.post('/api/user/add', usersController.addNewUser);

export default router;