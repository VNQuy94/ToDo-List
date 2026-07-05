import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import TodoToolbar from '@/components/todo/TodoToolbar';
import TodoForm from '@/components/todo/TodoForm';
import TodoList from '@/components/todo/TodoList';
import EditTodoDialog from '@/components/todo/EditTodoDialog';
import DeleteConfirmDialog from '@/components/todo/DeleteConfirmDialog';
import useTodo from '@/hooks/useTodo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * Component Trang quản lý Todo (TodoPage)
 * Đóng vai trò hiển thị Bố cục giao diện (Presentation Layout).
 * Nhận state và callback từ Custom Hook useTodo.
 */
export default function TodoPage() {
  const {
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
  } = useTodo();

  return (
    <div className="space-y-6">
      {/* Hiển thị Card lỗi khi API GET thất bại */}
      {error ? (
        <Card className="border-destructive/30 bg-destructive/5 rounded-xl overflow-hidden shadow-md">
          <CardHeader className="p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-3 bg-destructive/10 rounded-full text-destructive shrink-0">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold tracking-tight text-destructive">
                Đã xảy ra lỗi kết nối
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground max-w-sm">
                {error.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại trạng thái Docker/Backend.'}
              </CardDescription>
            </div>
            <Button
              onClick={fetchTodos}
              className="bg-destructive hover:bg-destructive/80 text-white flex gap-2 items-center px-4 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Thử lại</span>
            </Button>
          </CardHeader>
        </Card>
      ) : (
        <Card className="border-border bg-white shadow-md rounded-xl overflow-hidden">
          <CardHeader className="bg-stone-50/50 border-b border-border py-6 px-6">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Quản lý công việc
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Tạo mới và lọc danh sách các đầu việc từ cơ sở dữ liệu thật của Backend.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Form tạo mới */}
            <div>
              <TodoForm
                value={newTitle}
                onChange={setNewTitle}
                onSubmit={handleCreate}
                isCreating={isCreating}
                isPending={isPending}
                error={formError}
              />
            </div>

            {/* Bộ lọc và Tìm kiếm */}
            <div className="pt-2 border-t border-border/60">
              <TodoToolbar
                search={search}
                onSearchChange={setSearch}
                filter={filter}
                onFilterChange={setFilter}
                isPending={isPending}
              />
            </div>

            {/* Danh sách Todo thực tế từ API */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Danh sách công việc ({todos.length})
              </label>
              <TodoList
                todos={todos}
                onToggle={handleToggle}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                isLoading={isLoading}
                isPending={isPending}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog chỉnh sửa tiêu đề (Sub-component) */}
      <EditTodoDialog
        isOpen={editingTodo !== null}
        onClose={() => setEditingTodo(null)}
        title={editTitle}
        onTitleChange={setEditTitle}
        onSave={handleSaveEdit}
        isUpdating={isUpdating}
        error={dialogError}
      />

      {/* AlertDialog xác nhận xóa (Sub-component) */}
      <DeleteConfirmDialog
        isOpen={todoToDeleteId !== null}
        onClose={() => setTodoToDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
