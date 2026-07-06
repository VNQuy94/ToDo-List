import { z } from 'zod';

// Frontend validation schema for Todo
export const todoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Todo title cannot be empty.' })
    .min(3, { message: 'Title must be at least 3 characters long.' })
    .max(100, { message: 'Title cannot exceed 100 characters.' }),
});
