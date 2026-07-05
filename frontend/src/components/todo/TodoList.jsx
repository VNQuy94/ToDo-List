import React from 'react';
import { ClipboardList } from 'lucide-react';
import TodoItem from './TodoItem';
import { Skeleton } from '../ui/skeleton';

/**
 * Component danh sách hiển thị các Todo (TodoList)
 * Nhận thêm prop isPending để chuyển tiếp xuống từng TodoItem.
 */
export default function TodoList({ todos, onToggle, onEdit, onDelete, isLoading, isPending }) {
  // Trạng thái đang tải dữ liệu từ API: Hiển thị danh sách Skeleton
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-border rounded-lg bg-white shadow-sm"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0 mr-4">
              {/* Checkbox Skeleton */}
              <Skeleton className="h-5 w-5 rounded shrink-0" />
              {/* Tiêu đề Skeleton */}
              <Skeleton className="h-4 w-3/4 max-w-[250px] rounded" />
            </div>
            {/* Nút hành động Skeleton */}
            <div className="flex items-center space-x-1 shrink-0">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Trạng thái danh sách trống
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
          onEdit={onEdit}
          onDelete={onDelete}
          isPending={isPending}
        />
      ))}
    </div>
  );
}
