import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

// FilterSelect Component
export default function FilterSelect({ value, onChange, isPending }) {
  return (
    <Select value={value || 'all'} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger
        className="w-[160px] bg-white border-border focus:ring-primary disabled:opacity-50"
        aria-label="Filter task status"
      >
        <SelectValue placeholder="Filter status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
      </SelectContent>
    </Select>
  );
}
