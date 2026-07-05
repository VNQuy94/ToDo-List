import React from 'react';
import SearchBar from './SearchBar';
import FilterSelect from './FilterSelect';

/**
 * Component thanh công cụ (TodoToolbar) chứa ô tìm kiếm và bộ chọn lọc trạng thái.
 * Chuyển tiếp prop isPending xuống FilterSelect.
 */
export default function TodoToolbar({ search, onSearchChange, filter, onFilterChange, isPending }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
      <SearchBar value={search} onChange={onSearchChange} />
      <FilterSelect value={filter} onChange={onFilterChange} isPending={isPending} />
    </div>
  );
}
