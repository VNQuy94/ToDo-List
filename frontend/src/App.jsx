import React, { useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import TodoForm from './components/todo/TodoForm';
import SearchBar from './components/todo/SearchBar';
import FilterSelect from './components/todo/FilterSelect';
import TodoList from './components/todo/TodoList';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './components/ui/card';

/**
 * Component App chính để dựng Bố cục giao diện (Layout & Skeleton UI)
 */
export default function App() {
  // Cài đặt dữ liệu giả lập (Mock data) để hiển thị giao diện ban đầu
  const [todos, setTodos] = useState([
    { _id: '1', title: 'Học React 19 và Tailwind CSS v3', completed: false },
    { _id: '2', title: 'Thiết kế cấu trúc dự án Frontend Foundation', completed: true },
    { _id: '3', title: 'Xây dựng giao diện MERN premium gold theme', completed: false },
  ]);
  
  const [newTitle, setNewTitle] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Xử lý bộ lọc và tìm kiếm trên dữ liệu tĩnh
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'completed' && todo.completed) ||
      (filter === 'active' && !todo.completed);
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <Card className="border-border bg-white shadow-md rounded-xl overflow-hidden">
          <CardHeader className="bg-stone-50/50 border-b border-border py-6 px-6">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Quản lý công việc
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Tạo mới và lọc danh sách các đầu việc cần thực hiện hàng ngày.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Form tạo mới */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Thêm việc mới
              </label>
              <TodoForm
                value={newTitle}
                onChange={setNewTitle}
                onSubmit={() => {}} // CRUD logic chưa được kích hoạt ở bước này
              />
            </div>

            {/* Bộ lọc và Tìm kiếm */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border/60">
              <SearchBar value={search} onChange={setSearch} />
              <FilterSelect value={filter} onChange={setFilter} />
            </div>

            {/* Danh sách */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Danh sách công việc ({filteredTodos.length})
              </label>
              <TodoList
                todos={filteredTodos}
                onToggle={() => {}} // CRUD logic chưa được kích hoạt ở bước này
                onDelete={() => {}} // CRUD logic chưa được kích hoạt ở bước này
                onUpdate={() => {}} // CRUD logic chưa được kích hoạt ở bước này
                isLoading={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
