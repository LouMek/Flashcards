import { Router } from 'express';
import { createCollection, deleteCollection, getCollections, getOneCollection, modifyCollection } from '../controllers/collectionsController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { collectionIdSchema, updateCollectionSchema, createCollectionSchema } from '../models/collection.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getCollections);
router.get('/:collectionId', validateParams(collectionIdSchema), getOneCollection);
router.post('/', validateBody(createCollectionSchema), createCollection);
router.put('/:collectionId', validateParams(collectionIdSchema),  validateBody(updateCollectionSchema), modifyCollection);
router.delete('/:collectionId', validateParams(collectionIdSchema),deleteCollection);

export default router;