import React from 'react';
import { AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
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

            {/* Todo List & Pagination */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Tasks ({pagination.totalItems})
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

              {/* Pagination Controls */}
              {!isLoading && pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
                  <span className="text-xs text-muted-foreground">
                    Showing page {pagination.page} of {pagination.totalPages} ({pagination.totalItems} total tasks)
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1 || isPending}
                      className="h-8 w-8 p-0 rounded-md transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={pagination.page === p ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(p)}
                        disabled={isPending}
                        className={`h-8 w-8 p-0 rounded-md transition-all ${
                          pagination.page === p
                            ? 'bg-stone-900 text-stone-50 hover:bg-stone-850 shadow-sm'
                            : 'hover:bg-stone-100'
                        }`}
                      >
                        {p}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages || isPending}
                      className="h-8 w-8 p-0 rounded-md transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
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
