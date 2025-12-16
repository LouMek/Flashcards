import { Router } from 'express';
import { getAllUsers, getUser, deleteUser } from '../controllers/usersController.js';
// import { validateParams } from '../middlewares/validateParams.js';
// import { userIdSchema } from '../models/user.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { isAdministrator } from '../middleware/isAdministrator.js';


const router = Router();

router.use(authenticateToken);
router.use(isAdministrator);

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);

export default router;