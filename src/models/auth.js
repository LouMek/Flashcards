import { z } from 'zod';

export const registerSchema = z.object({
    email: z.email(),
    firstName: z.string().min(1, 'First name is required').max(50, 'First name must be at most 50 characters'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be at most 50 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(255, 'Password must be at most 255 characters') 
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8, 'Password must be at least 8 characters').max(255, 'Password must be at most 255 characters')
});