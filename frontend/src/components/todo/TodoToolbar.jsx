import React from 'react';
import SearchBar from './SearchBar';
import FilterSelect from './FilterSelect';

// TodoToolbar Component
export default function TodoToolbar({ search, onSearchChange, filter, onFilterChange, isPending }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
      <SearchBar value={search} onChange={onSearchChange} />
      <FilterSelect value={filter} onChange={onFilterChange} isPending={isPending} />
    </div>
  );
}
