import todoService from '../services/todo.service.js';

/**
 * Tầng Bộ Điều Khiển (Controller Layer) chỉ đảm nhiệm xử lý giao thức HTTP:
 * - Trích xuất tham số từ request.
 * - Gọi các service nghiệp vụ thích hợp.
 * - Trả về phản hồi JSON chuẩn hóa cùng HTTP status code tương ứng.
 */
class TodoController {
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

  deleteTodo = async (req, res, next) => {
    try {
      const todo = await todoService.deleteTodo(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Xóa Todo thành công.',
        id: todo._id,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new TodoController();
