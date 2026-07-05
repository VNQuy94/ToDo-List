import React from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

/**
 * Component Form thêm Todo mới (TodoForm)
 * Hỗ trợ nhãn Label tiếp cận dễ dàng (Accessibility),
 * tự động khóa form khi có tiến trình mạng đang xử lý (isPending).
 */
export default function TodoForm({ value, onChange, onSubmit, isCreating, isPending, error }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <div className="space-y-2 w-full">
      {/* Label được đưa vào trong form và có htmlFor trỏ tới ID của Input */}
      <label
        htmlFor="new-todo-title"
        className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block"
      >
        Thêm việc mới
      </label>
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <Input
          id="new-todo-title"
          type="text"
          placeholder="Thêm công việc mới (tối thiểu 3 ký tự)..."
          value={value || ''}
          onChange={(e) => onChange && onChange(e.target.value)}
          disabled={isPending}
          className={`flex-1 bg-white border-border focus-visible:ring-primary ${
            error ? 'border-destructive focus-visible:ring-destructive' : ''
          }`}
        />
        <Button
          type="submit"
          disabled={isPending || !value || value.trim().length < 3}
          className="bg-primary hover:bg-primary-hover text-white flex gap-1.5 items-center px-5 transition-colors shrink-0 disabled:opacity-50"
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang thêm...</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Thêm</span>
            </>
          )}
        </Button>
      </form>
      {error && (
        <p className="text-xs font-semibold text-destructive animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
