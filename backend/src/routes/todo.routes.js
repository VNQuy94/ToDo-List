import { Router } from 'express';
import todoController from '../controllers/todo.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createTodoSchema,
  updateTodoSchema,
  deleteTodoSchema,
  getTodosSchema,
} from '../validations/todo.validation.js';

const router = Router();

// Đường dẫn: /api/todos
router
  .route('/')
  .get(validate(getTodosSchema), todoController.getTodos)
  .post(validate(createTodoSchema), todoController.createTodo);

// Đường dẫn: /api/todos/:id
router
  .route('/:id')
  .put(validate(updateTodoSchema), todoController.updateTodo)
  .delete(validate(deleteTodoSchema), todoController.deleteTodo);

export default router;
