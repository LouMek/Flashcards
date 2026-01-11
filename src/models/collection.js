import { z } from 'zod';

export const createCollectionSchema = z.object({
    title: z.string().min(1, 'Title is required').max(50, 'Title must be at most 50 characters'),
    description: z.string().max(255, 'Description must be at most 255 characters').optional(),
    isPublic: z.boolean().optional()
});

export const updateCollectionSchema = z.object({
    title: z.string().min(1, 'Title is required').max(50, 'Title must be at most 50 characters').optional(),
    description: z.string().max(255, 'Description must be at most 255 characters').optional(),
    isPublic: z.boolean().optional()
});

export const collectionIdSchema = z.object({
    collectionId: z.uuid()
});