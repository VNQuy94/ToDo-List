import React from 'react';
import { ClipboardList } from 'lucide-react';
import TodoItem from './TodoItem';

/**
 * Component danh sách hiển thị các Todo (TodoList)
 */
export default function TodoList({ todos, onToggle, onDelete, onUpdate, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Đang tải danh sách công việc...</p>
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-border rounded-xl bg-white shadow-sm">
        <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
          <ClipboardList className="h-8 w-8" />
        </div>
        <h3 className="font-semibold text-foreground text-base">Không có công việc nào</h3>
        <p className="text-sm text-muted-foreground mt-1 text-center max-w-xs">
          Danh sách trống hoặc bộ lọc không khớp với kết quả nào. Hãy thêm công việc mới để bắt đầu!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
