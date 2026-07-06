import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getTodosApi, createTodoApi, updateTodoApi, deleteTodoApi } from '@/api/todo.api';
import { todoSchema } from '@/schemas/todo.schema';

// Hook to manage todo state and operations
export default function useTodo() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState(null);

  const [editingTodo, setEditingTodo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [dialogError, setDialogError] = useState(null);

  const [todoToDeleteId, setTodoToDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Debounce search input (500ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Fetch todos from backend
  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }
      if (filter !== 'all') {
        params.completed = filter === 'completed';
      }

      const response = await getTodosApi(params);
      if (response && response.success) {
        setTodos(response.data || []);
      } else {
        throw new Error('Server responded with a failure status.');
      }
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      setError({
        message: err.response?.data?.message || err.message || 'Unable to connect to the backend server.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, filter]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Create a new todo
  const handleCreate = async (e) => {
    if (e) e.preventDefault();
    const trimmedTitle = newTitle.trim();

    // Client-side validation using Zod
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
        toast.success('Task added successfully!');
        setNewTitle('');
        fetchTodos();
      } else {
        throw new Error('Failed to add task.');
      }
    } catch (err) {
      console.error('Error creating todo:', err);
      const backendValidationError = err.response?.data?.errors?.[0]?.message;
      const generalErrorMessage = err.response?.data?.message;
      const errMsg = backendValidationError || generalErrorMessage || 'Server connection error.';

      setFormError(errMsg);
      toast.error('Failed to add task.');
    } finally {
      setIsCreating(false);
    }
  };

  // Toggle todo completed status
  const handleToggle = async (id, completed) => {
    try {
      const response = await updateTodoApi(id, { completed });
      if (response && response.success) {
        toast.success(completed ? 'Task marked as completed!' : 'Task reopened.');
        fetchTodos();
      } else {
        throw new Error('Failed to update status.');
      }
    } catch (err) {
      console.error('Error toggling todo:', err);
      toast.error('Failed to update task status.');
    }
  };

  // Prepare edit state
  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setDialogError(null);
  };

  // Save edited todo title
  const handleSaveEdit = async () => {
    const trimmedTitle = editTitle.trim();

    // Client-side validation using Zod
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
        toast.success('Task title updated successfully!');
        setEditingTodo(null);
        fetchTodos();
      } else {
        throw new Error('Failed to save updates.');
      }
    } catch (err) {
      console.error('Error updating todo title:', err);
      const backendValidationError = err.response?.data?.errors?.[0]?.message;
      const generalErrorMessage = err.response?.data?.message;
      const errMsg = backendValidationError || generalErrorMessage || 'Server connection error.';

      setDialogError(errMsg);
      toast.error('Failed to update task.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Prepare delete ID
  const handleDeleteClick = (id) => {
    setTodoToDeleteId(id);
  };

  // Confirm and delete todo
  const handleConfirmDelete = async (e) => {
    if (e) e.preventDefault();
    setIsDeleting(true);

    try {
      const response = await deleteTodoApi(todoToDeleteId);
      if (response && response.success) {
        toast.success('Task deleted successfully!');
        setTodoToDeleteId(null);
        fetchTodos();
      } else {
        throw new Error('Failed to delete task.');
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
      const generalErrorMessage = err.response?.data?.message || err.message || 'Server connection error.';
      toast.error(generalErrorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const isPending = isLoading || isCreating || isUpdating || isDeleting;

  return {
    todos,
    isLoading,
    isPending,
    error,
    fetchTodos,
    
    search,
    setSearch,
    filter,
    setFilter,

    newTitle,
    setNewTitle,
    isCreating,
    formError,
    handleCreate,

    handleToggle,

    editingTodo,
    setEditingTodo,
    editTitle,
    setEditTitle,
    isUpdating,
    dialogError,
    handleEditClick,
    handleSaveEdit,

    todoToDeleteId,
    setTodoToDeleteId,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
  };
}
