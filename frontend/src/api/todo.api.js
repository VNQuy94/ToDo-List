import api from './axios.js';

/**
 * Lấy danh sách Todos kèm theo các tham số bộ lọc/phân trang (query params).
 */
export const getTodosApi = async (params) => {
  const response = await api.get('/todos', { params });
  return response.data;
};

/**
 * Tạo mới Todo.
 */
export const createTodoApi = async (todoData) => {
  const response = await api.post('/todos', todoData);
  return response.data;
};

/**
 * Cập nhật thông tin Todo (tiêu đề hoặc trạng thái completed).
 */
export const updateTodoApi = async (id, todoData) => {
  const response = await api.put(`/todos/${id}`, todoData);
  return response.data;
};

/**
 * Xóa Todo.
 */
export const deleteTodoApi = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};
