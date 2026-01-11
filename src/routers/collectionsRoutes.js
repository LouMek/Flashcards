import { Router } from 'express';
import { createCollection, deleteCollection, getCollections, getOneCollection, modifyCollection } from '../controllers/collectionsController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getCollections);
router.get('/:id', getOneCollection);
router.post('/', createCollection);
router.put('/:id', modifyCollection);
router.delete('/:id', deleteCollection);

export default router;