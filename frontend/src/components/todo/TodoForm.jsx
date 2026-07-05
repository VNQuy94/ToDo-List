import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

/**
 * Component Form thêm Todo mới (TodoForm)
 */
export default function TodoForm({ value, onChange, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <Input
        type="text"
        placeholder="Thêm công việc mới (tối thiểu 3 ký tự)..."
        value={value || ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="flex-1 bg-white border-border focus-visible:ring-primary focus-visible:border-primary"
      />
      <Button
        type="submit"
        className="bg-primary hover:bg-primary-hover text-white flex gap-1 items-center px-5 transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>Thêm</span>
      </Button>
    </form>
  );
}
