import { Router } from 'express';
import { createCollection, deleteCollection, getAllCollections, getOneCollection } from '../controllers/collectionsController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getAllCollections);
router.get('/:id', getOneCollection);
router.post('/', createCollection);
router.delete('/:id', deleteCollection);

export default router;