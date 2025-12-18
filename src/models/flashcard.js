import { z } from 'zod';

export const createFlashcardSchema = z.object({
    frontText: z.string().min(1, "Front text is required").max(50, "Front text must be at most 50 characters"),
    backText: z.string().min(1, "Back text is required").max(50, "Back text must be at most 50 characters"),
    // frontUrl: z.url().max(255, "Front url must be at most 255 characters"),
    // backUrl: z.url().max(255, "Back url must be at most 255 characters"),
    // collectionId: z.uuid()
});

export const flashcardIdSchema = z.object({
    flashcardId: z.uuid()
});