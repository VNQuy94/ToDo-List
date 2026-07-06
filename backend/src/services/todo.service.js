import Todo from '../models/todo.js';
import { AppError } from '../utils/appError.js';

class TodoService {
  // Get all todos with search, filter, and pagination
  async getTodos(filters = {}) {
    const { search, completed, page = 1, limit = 10 } = filters;
    const mongoQuery = {};

    if (completed !== undefined) {
      mongoQuery.completed = completed;
    }

    if (search) {
      mongoQuery.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const totalItems = await Todo.countDocuments(mongoQuery);
    
    const data = await Todo.find(mongoQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      pagination: {
        totalItems,
        page,
        limit,
        totalPages,
      },
    };
  }

  // Create a new todo
  async createTodo(todoData) {
    return await Todo.create(todoData);
  }

  // Update a todo by ID
  async updateTodo(id, updateData) {
    const todo = await Todo.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!todo) {
      throw new AppError('Todo not found with the requested ID.', 404);
    }

    return todo;
  }

  // Delete a todo by ID
  async deleteTodo(id) {
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      throw new AppError('Todo not found with the requested ID.', 404);
    }

    return todo;
  }
}

export default new TodoService();
