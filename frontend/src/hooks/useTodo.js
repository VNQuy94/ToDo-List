import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getTodosApi, createTodoApi, updateTodoApi, deleteTodoApi } from '@/api/todo.api';
import { todoSchema } from '@/schemas/todo.schema';
import useSearchParams from './useSearchParams';

// Hook to manage todo state, operations, and URL-based pagination/filtering
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

  // URL Query Parameters synchronization
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract pagination and filters from URL or use defaults
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  
  const urlFilter = searchParams.get('filter') || 'all';
  const urlSearch = searchParams.get('search') || '';

  // Local UI states
  const [search, setSearchState] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
  const [filter, setFilterState] = useState(urlFilter);

  // Pagination metadata state from backend response
  const [pagination, setPagination] = useState({
    totalItems: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Debounce search input (500ms delay) and update URL
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (search.trim()) {
          next.set('search', search.trim());
        } else {
          next.delete('search');
        }
        next.delete('page'); // Reset page to 1 on search change
        return next;
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [search, setSearchParams]);

  // Set filter and reset page in URL
  const setFilter = useCallback((newFilter) => {
    setFilterState(newFilter);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newFilter === 'all') {
        next.delete('filter');
      } else {
        next.set('filter', newFilter);
      }
      next.delete('page'); // Reset page to 1 on filter change
      return next;
    });
  }, [setSearchParams]);

  // Direct search setter for input onChange
  const setSearch = useCallback((newSearch) => {
    setSearchState(newSearch);
  }, []);

  // Update page parameter in URL
  const handlePageChange = useCallback((newPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newPage <= 1) {
        next.delete('page');
      } else {
        next.set('page', newPage.toString());
      }
      return next;
    });
  }, [setSearchParams]);

  // Fetch todos from backend
  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 10,
      };
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }
      if (filter !== 'all') {
        params.completed = filter === 'completed';
      }

      const response = await getTodosApi(params);
      if (response && response.success) {
        setTodos(response.data || []);
        const backendPagination = response.pagination || {};
        setPagination({
          totalItems: parseInt(backendPagination.totalItems || '0', 10),
          page: parseInt(backendPagination.page || '1', 10),
          limit: parseInt(backendPagination.limit || '10', 10),
          totalPages: parseInt(backendPagination.totalPages || '1', 10),
        });
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
  }, [debouncedSearch, filter, page]);

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
    
    pagination,
    handlePageChange,

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
