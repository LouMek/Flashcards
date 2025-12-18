import { Router } from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { createFlashcard, deleteFlashcard, getFlashcardsByCollection, getFlashcard} from '../controllers/flashcardsController.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { createFlashcardSchema, flashcardIdSchema } from '../models/flashcard.js';
import { collectionIdSchema } from '../models/collection.js';


const router = Router();

router.use(authenticateToken);

//id de la collection
router.post('/:collectionId', validateBody(createFlashcardSchema), createFlashcard);
router.delete('/:flashcardId', validateParams(flashcardIdSchema), deleteFlashcard);

router.get('/collection/:collectionId', validateParams(collectionIdSchema), getFlashcardsByCollection); //Pour écup toutes les flashcards d'une collection
router.get('/:flashcardId', validateParams(flashcardIdSchema), getFlashcard);


// router.post('/:flashcardId', ); //Pour modifier une flashcard spécifique ??

export default router;