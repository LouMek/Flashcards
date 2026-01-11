import { Router } from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { getRevisionsByCollection, createOrUpdateRevision } from '../controllers/revisionsController.js';
import { validateQuery, validateParams } from '../middleware/validation.js';
import { collectionIdSchema } from '../models/collection.js';
import { flashcardIdSchema } from '../models/flashcard.js';
import { createOrUpdateRevisionSchema } from '../models/revision.js';

const router = Router();

router.use(authenticateToken);

//Récupérer les révisions d'une collection pour les dates passée ou au jour j
//Réviser une flashcard; mettre a jour la date de révision de la flashcard

// Permet de réviser les flashcards d'une collection
router.get('/:collectionId', validateParams(collectionIdSchema), getRevisionsByCollection); 
router.post('/:flashcardId', validateParams(flashcardIdSchema), validateQuery(createOrUpdateRevisionSchema), createOrUpdateRevision); //mettre à jour ou créé la révision d'une flashcard
// localhost:3000/revisions/:flashcardId?level=1

export default router;