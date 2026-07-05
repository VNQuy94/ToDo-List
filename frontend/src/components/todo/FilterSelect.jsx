import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

/**
 * Component bộ lọc trạng thái (FilterSelect)
 */
export default function FilterSelect({ value, onChange }) {
  return (
    <Select value={value || 'all'} onValueChange={onChange}>
      <SelectTrigger className="w-[160px] bg-white border-border focus:ring-primary">
        <SelectValue placeholder="Lọc trạng thái" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả</SelectItem>
        <SelectItem value="active">Chưa hoàn thành</SelectItem>
        <SelectItem value="completed">Đã hoàn thành</SelectItem>
      </SelectContent>
    </Select>
  );
}
