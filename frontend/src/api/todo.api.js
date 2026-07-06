import api from './axios.js';

// Get todos with filters/pagination
export const getTodosApi = async (params) => {
  const response = await api.get('/todos', { params });
  return response.data;
};

// Create a new todo
export const createTodoApi = async (todoData) => {
  const response = await api.post('/todos', todoData);
  return response.data;
};

// Update an existing todo (title or completed status)
export const updateTodoApi = async (id, todoData) => {
  const response = await api.put(`/todos/${id}`, todoData);
  return response.data;
};

// Delete a todo by ID
export const deleteTodoApi = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};
