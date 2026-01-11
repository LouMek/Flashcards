import { Router } from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { createFlashcard, deleteFlashcard, getFlashcardsByCollection, getFlashcard, updateFlashcard} from '../controllers/flashcardsController.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { createFlashcardSchema, updateFlashcardSchema, flashcardIdSchema } from '../models/flashcard.js';
import { collectionIdSchema } from '../models/collection.js';


const router = Router();

router.use(authenticateToken);

//id de la collection
router.post('/:collectionId', validateBody(createFlashcardSchema), createFlashcard);
router.get('/:collectionId', validateParams(collectionIdSchema), getFlashcardsByCollection); //Pour récup toutes les flashcards d'une collection

router.get('/:flashcardId', validateParams(flashcardIdSchema), getFlashcard);
router.delete('/:flashcardId', validateParams(flashcardIdSchema), deleteFlashcard);

router.put('/:flashcardId', validateParams(flashcardIdSchema), validateBody(updateFlashcardSchema), updateFlashcard); //Pour modifier une flashcard spécifique

export default router;