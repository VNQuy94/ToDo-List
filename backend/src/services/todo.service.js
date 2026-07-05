import Todo from '../models/todo.js';
import { AppError } from '../utils/appError.js';

/**
 * Tầng Nghiệp Vụ (Service Layer) quản lý việc tương tác trực tiếp với Database.
 */
class TodoService {
  /**
   * Lấy danh sách Todos có hỗ trợ tìm kiếm, lọc trạng thái, và phân trang.
   */
  async getTodos(filters = {}) {
    const { search, completed, page = 1, limit = 10 } = filters;
    const mongoQuery = {};

    // Lọc theo trạng thái hoàn thành
    if (completed !== undefined) {
      mongoQuery.completed = completed;
    }

    // Tìm kiếm không phân biệt hoa thường theo tiêu đề
    if (search) {
      mongoQuery.title = { $regex: search, $options: 'i' };
    }

    // Thực hiện tính toán phân trang
    const skip = (page - 1) * limit;
    const totalItems = await Todo.countDocuments(mongoQuery);
    
    // Sắp xếp các Todo mới tạo lên đầu tiên
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

  /**
   * Tạo Todo mới.
   */
  async createTodo(todoData) {
    return await Todo.create(todoData);
  }

  /**
   * Cập nhật Todo.
   */
  async updateTodo(id, updateData) {
    // runValidators: true đảm bảo kiểm tra các điều kiện validate của Schema khi cập nhật
    const todo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      throw new AppError('Không tìm thấy Todo với ID được yêu cầu.', 404);
    }

    return todo;
  }

  /**
   * Xóa Todo.
   */
  async deleteTodo(id) {
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      throw new AppError('Không tìm thấy Todo với ID được yêu cầu.', 404);
    }

    return todo;
  }
}

export default new TodoService();
