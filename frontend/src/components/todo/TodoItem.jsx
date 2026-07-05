import React from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';

/**
 * Component hiển thị từng hàng Todo đơn lẻ (TodoItem)
 * Hỗ trợ các thẻ tiếp cận aria-label và tự động khóa tương tác khi có cuộc gọi mạng đang chờ (isPending).
 */
export default function TodoItem({ todo, onToggle, onEdit, onDelete, isPending }) {
  return (
    <div
      className={`flex items-center justify-between p-4 border border-border rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md ${
        todo.completed ? 'opacity-70 bg-stone-50/50' : ''
      }`}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0 mr-4">
        {/* Checkbox của shadcn/ui */}
        <Checkbox
          id={`todo-${todo._id}`}
          checked={todo.completed}
          onCheckedChange={(checked) => onToggle && onToggle(todo._id, !!checked)}
          disabled={isPending}
          className="h-5 w-5 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white focus-visible:ring-primary shrink-0 disabled:opacity-50"
        />
        <label
          htmlFor={`todo-${todo._id}`}
          className={`text-sm font-medium truncate select-none cursor-pointer flex-1 ${
            todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'
          }`}
        >
          {todo.title}
        </label>
      </div>

      <div className="flex items-center space-x-1 shrink-0">
        {/* Nút sửa - Có nhãn tiếp cận aria-label */}
        <Button
          size="icon"
          variant="ghost"
          aria-label="Chỉnh sửa công việc"
          className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 focus-visible:ring-primary"
          onClick={() => onEdit && onEdit(todo)}
          disabled={todo.completed || isPending}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        {/* Nút xóa - Có nhãn tiếp cận aria-label */}
        <Button
          size="icon"
          variant="ghost"
          aria-label="Xóa công việc"
          className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 focus-visible:ring-destructive"
          onClick={() => onDelete && onDelete(todo._id)}
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
