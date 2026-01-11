import { z } from 'zod';

export const createOrUpdateRevisionSchema = z.object({
    level: z.coerce.number().int('Level must be an integer')
    .min(1, 'Level must be between 1 and 5').max(5, 'Level must be between 1 and 5').optional()
});