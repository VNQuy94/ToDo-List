import todoService from '../services/todo.service.js';

class TodoController {
  // Get all todos
  getTodos = async (req, res, next) => {
    try {
      const result = await todoService.getTodos(req.query);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create a new todo
  createTodo = async (req, res, next) => {
    try {
      const todo = await todoService.createTodo(req.body);
      res.status(201).json({
        success: true,
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  };

  // Update an existing todo by ID
  updateTodo = async (req, res, next) => {
    try {
      const todo = await todoService.updateTodo(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete an existing todo by ID
  deleteTodo = async (req, res, next) => {
    try {
      const todo = await todoService.deleteTodo(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Todo deleted successfully.',
        data: { id: todo._id },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new TodoController();
