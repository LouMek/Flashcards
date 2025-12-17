import { Router } from 'express';
import { createCollection, deleteCollection, getAllCollections, getOneCollection } from '../controllers/collectionsController.js';

const router = Router();

router.get('/', getAllCollections);
router.get('/:id', getOneCollection);
router.post('/', createCollection);
router.delete('/:id', deleteCollection);

export default router;