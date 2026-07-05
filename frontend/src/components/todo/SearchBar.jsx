import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';

/**
 * Component thanh tìm kiếm (SearchBar)
 */
export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Tìm kiếm công việc..."
        value={value || ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="pl-9 bg-white border-border focus-visible:ring-primary focus-visible:border-primary"
      />
    </div>
  );
}
