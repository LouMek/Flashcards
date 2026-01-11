import { z } from 'zod';

export const createFlashcardSchema = z.object({
    frontText: z.string().min(1, 'Front text is required').max(50, 'Front text must be at most 50 characters'),
    backText: z.string().min(1, 'Back text is required').max(50, 'Back text must be at most 50 characters'),
    frontUrl: z.url().max(255, 'Front url must be at most 255 characters').optional(), //optional permet de ne pas être obligé de mettre le paramètre
    backUrl: z.url().max(255, 'Back url must be at most 255 characters').optional() 
});

export const updateFlashcardSchema = z.object({
    frontText: z.string().min(1, 'Front text is required').max(50, 'Front text must be at most 50 characters').optional(),
    backText: z.string().min(1, 'Back text is required').max(50, 'Back text must be at most 50 characters').optional(),
    frontUrl: z.url().max(255, 'Front url must be at most 255 characters').optional(), 
    backUrl: z.url().max(255, 'Back url must be at most 255 characters').optional() 
});

export const flashcardIdSchema = z.object({
    flashcardId: z.uuid()
});