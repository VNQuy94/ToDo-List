import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getTodosApi, createTodoApi, updateTodoApi, deleteTodoApi } from '@/api/todo.api';
import { todoSchema } from '@/schemas/todo.schema';

/**
 * Custom Hook useTodo
 * Quản lý toàn bộ State, logic kiểm định (Zod) và các cuộc gọi API CRUD cho tính năng Todo.
 * Phân tách hoàn toàn Business Logic ra khỏi tầng hiển thị JSX.
 */
export default function useTodo() {
  // Trạng thái danh sách Todo từ Backend
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Trạng thái khi tạo mới Todo
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState(null);

  // Trạng thái chỉnh sửa Todo bằng Dialog
  const [editingTodo, setEditingTodo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [dialogError, setDialogError] = useState(null);

  // Trạng thái xác nhận xóa Todo bằng AlertDialog
  const [todoToDeleteId, setTodoToDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Trạng thái bộ lọc tìm kiếm
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  /**
   * Hàm gọi API lấy danh sách Todo từ backend
   */
  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (search.trim()) {
        params.search = search.trim();
      }
      if (filter !== 'all') {
        params.completed = filter === 'completed';
      }

      const response = await getTodosApi(params);
      if (response && response.success) {
        setTodos(response.data || []);
      } else {
        throw new Error('Máy chủ phản hồi trạng thái thất bại.');
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách Todos:', err);
      setError({
        message: err.response?.data?.message || err.message || 'Không thể kết nối đến máy chủ backend.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, filter]);

  // Hook nạp dữ liệu tự động khi mount và mỗi khi bộ lọc thay đổi
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  /**
   * Hàm xử lý tạo mới Todo qua API POST
   */
  const handleCreate = async (e) => {
    if (e) e.preventDefault();
    const trimmedTitle = newTitle.trim();

    // Client-side Validation sử dụng Zod schema
    const validation = todoSchema.safeParse({ title: trimmedTitle });
    if (!validation.success) {
      setFormError(validation.error.errors[0].message);
      return;
    }

    setIsCreating(true);
    setFormError(null);

    try {
      const response = await createTodoApi({ title: trimmedTitle });
      
      if (response && response.success) {
        toast.success('Đã thêm công việc mới thành công!');
        setNewTitle(''); // Xóa trắng ô input
        fetchTodos();    // Làm mới danh sách công việc từ backend
      } else {
        throw new Error('Không thể thêm công việc mới.');
      }
    } catch (err) {
      console.error('Lỗi khi thêm Todo mới:', err);
      const backendValidationError = err.response?.data?.errors?.[0]?.message;
      const generalErrorMessage = err.response?.data?.message;
      const errMsg = backendValidationError || generalErrorMessage || 'Lỗi kết nối máy chủ.';

      setFormError(errMsg);
      toast.error('Thêm công việc mới thất bại.');
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Xử lý bật/tắt trạng thái hoàn thành (Toggle checkbox) -> Gọi API cập nhật
   */
  const handleToggle = async (id, completed) => {
    try {
      const response = await updateTodoApi(id, { completed });
      if (response && response.success) {
        toast.success(completed ? 'Đã đánh dấu hoàn thành công việc!' : 'Đã mở lại công việc.');
        fetchTodos(); // Làm mới danh sách
      } else {
        throw new Error('Cập nhật trạng thái thất bại.');
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái:', err);
      toast.error('Không thể cập nhật trạng thái công việc.');
    }
  };

  /**
   * Lưu thông tin Todo cần sửa vào state để mở Dialog
   */
  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setDialogError(null);
  };

  /**
   * Gửi yêu cầu cập nhật tiêu đề trên Dialog (API PUT)
   */
  const handleSaveEdit = async () => {
    const trimmedTitle = editTitle.trim();

    // Client-side Validation sử dụng Zod schema
    const validation = todoSchema.safeParse({ title: trimmedTitle });
    if (!validation.success) {
      setDialogError(validation.error.errors[0].message);
      return;
    }

    setIsUpdating(true);
    setDialogError(null);

    try {
      const response = await updateTodoApi(editingTodo._id, { title: trimmedTitle });
      if (response && response.success) {
        toast.success('Cập nhật tiêu đề công việc thành công!');
        setEditingTodo(null); // Đóng Dialog
        fetchTodos();         // Làm mới danh sách
      } else {
        throw new Error('Không thể lưu cập nhật.');
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật tiêu đề Todo:', err);
      const backendValidationError = err.response?.data?.errors?.[0]?.message;
      const generalErrorMessage = err.response?.data?.message;
      const errMsg = backendValidationError || generalErrorMessage || 'Lỗi kết nối máy chủ.';

      setDialogError(errMsg);
      toast.error('Cập nhật công việc thất bại.');
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Lưu ID của Todo muốn xóa để mở AlertDialog xác nhận
   */
  const handleDeleteClick = (id) => {
    setTodoToDeleteId(id);
  };

  /**
   * Gửi yêu cầu xóa Todo thực tế qua API DELETE
   */
  const handleConfirmDelete = async (e) => {
    if (e) e.preventDefault(); // Ngăn Dialog tự đóng trước khi API hoàn tất
    setIsDeleting(true);

    try {
      const response = await deleteTodoApi(todoToDeleteId);
      if (response && response.success) {
        toast.success('Đã xóa công việc thành công!');
        setTodoToDeleteId(null); // Đóng AlertDialog
        fetchTodos();            // Làm mới danh sách công việc
      } else {
        throw new Error('Xóa công việc thất bại.');
      }
    } catch (err) {
      console.error('Lỗi khi xóa Todo:', err);
      const generalErrorMessage = err.response?.data?.message || err.message || 'Lỗi kết nối máy chủ.';
      toast.error(generalErrorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  // Trạng thái chung khi có bất kỳ tiến trình mạng nào đang chạy
  const isPending = isLoading || isCreating || isUpdating || isDeleting;

  return {
    // Trạng thái & Action nạp danh sách
    todos,
    isLoading,
    isPending,
    error,
    fetchTodos,
    
    // Tìm kiếm & Lọc
    search,
    setSearch,
    filter,
    setFilter,

    // Tạo mới Todo
    newTitle,
    setNewTitle,
    isCreating,
    formError,
    handleCreate,

    // Cập nhật Todo (Toggle)
    handleToggle,

    // Chỉnh sửa tiêu đề Todo (Dialog)
    editingTodo,
    setEditingTodo,
    editTitle,
    setEditTitle,
    isUpdating,
    dialogError,
    handleEditClick,
    handleSaveEdit,

    // Xóa Todo (AlertDialog)
    todoToDeleteId,
    setTodoToDeleteId,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
  };
}
