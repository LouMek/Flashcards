import { Router } from 'express';
import { getAllUsers, getUser, deleteUser } from '../controllers/usersController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { isAdministrator } from '../middleware/isAdministrator.js';
import { validateParams } from '../middleware/validation.js';
import { userIdSchema } from '../models/user.js';

const router = Router();

router.use(authenticateToken);
router.use(isAdministrator);

router.get('/', getAllUsers);
router.get('/:userId', validateParams(userIdSchema),getUser);
router.delete('/:userId', validateParams(userIdSchema), deleteUser);

export default router;