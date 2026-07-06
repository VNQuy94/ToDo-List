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

// TodoPage Presentation Component
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
      {/* Show Error Card if API GET fails */}
      {error ? (
        <Card className="border-destructive/30 bg-destructive/5 rounded-xl overflow-hidden shadow-md">
          <CardHeader className="p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-3 bg-destructive/10 rounded-full text-destructive shrink-0">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold tracking-tight text-destructive">
                Connection Error
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground max-w-sm">
                {error.message || 'Unable to connect to the server. Please check your Docker/Backend status.'}
              </CardDescription>
            </div>
            <Button
              onClick={fetchTodos}
              className="bg-destructive hover:bg-destructive/80 text-white flex gap-2 items-center px-4 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </Button>
          </CardHeader>
        </Card>
      ) : (
        <Card className="border-border bg-white shadow-md rounded-xl overflow-hidden">
          <CardHeader className="bg-stone-50/50 border-b border-border py-6 px-6">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Task Manager
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Create and filter your tasks linked to the backend database.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Create Form */}
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

            {/* Filters & Search */}
            <div className="pt-2 border-t border-border/60">
              <TodoToolbar
                search={search}
                onSearchChange={setSearch}
                filter={filter}
                onFilterChange={setFilter}
                isPending={isPending}
              />
            </div>

            {/* Todo List */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Tasks ({todos.length})
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

      {/* Edit Dialog */}
      <EditTodoDialog
        isOpen={editingTodo !== null}
        onClose={() => setEditingTodo(null)}
        title={editTitle}
        onTitleChange={setEditTitle}
        onSave={handleSaveEdit}
        isUpdating={isUpdating}
        error={dialogError}
      />

      {/* Delete Confirmation Alert */}
      <DeleteConfirmDialog
        isOpen={todoToDeleteId !== null}
        onClose={() => setTodoToDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
