import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Schema for creating a new todo
export const createTodoSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Todo title is required.',
      })
      .trim()
      .min(3, { message: 'Title must be at least 3 characters long.' })
      .max(100, { message: 'Title cannot exceed 100 characters.' }),
  }),
});

// Schema for updating an existing todo
export const updateTodoSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, { message: 'Invalid Todo ID format.' }),
  }),
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(3, { message: 'Title must be at least 3 characters long.' })
        .max(100, { message: 'Title cannot exceed 100 characters.' })
        .optional(),
      completed: z
        .boolean({
          invalid_type_error: 'Completed status must be a boolean (true or false).',
        })
        .optional(),
    })
    .refine((data) => data.title !== undefined || data.completed !== undefined, {
      message: 'You must update either the title or completed status.',
    }),
});

// Schema for deleting a todo
export const deleteTodoSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, { message: 'Invalid Todo ID format.' }),
  }),
});

// Schema for querying todos (supports search, filters, pagination)
export const getTodosSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    // Parse query string boolean values
    completed: z.preprocess((val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      return undefined;
    }, z.boolean().optional()),
    // Parse query string numbers
    page: z.preprocess((val) => (val ? parseInt(val, 10) : undefined), z.number().int().positive().optional()),
    limit: z.preprocess((val) => (val ? parseInt(val, 10) : undefined), z.number().int().positive().optional()),
  }),
});
