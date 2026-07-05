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
 * Tích hợp nhãn tiếp cận aria-label và hỗ trợ khóa dropdown khi đang gửi yêu cầu (isPending).
 */
export default function FilterSelect({ value, onChange, isPending }) {
  return (
    <Select value={value || 'all'} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger
        className="w-[160px] bg-white border-border focus:ring-primary disabled:opacity-50"
        aria-label="Lọc trạng thái công việc"
      >
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
