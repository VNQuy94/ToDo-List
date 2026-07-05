import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TodoList from '@/components/todo/TodoList';

describe('TodoList Component', () => {
  const mockTodos = [
    { _id: '1', title: 'Task Một', completed: false },
    { _id: '2', title: 'Task Hai', completed: true },
  ];

  it('should render a list of todo items (Arrange/Assert)', () => {
    // Arrange: Render danh sách có 2 Todo
    render(
      <TodoList
        todos={mockTodos}
        onToggle={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        isLoading={false}
        isPending={false}
      />
    );

    // Assert: Xác minh render đúng 2 tiêu đề
    expect(screen.getByText('Task Một')).toBeInTheDocument();
    expect(screen.getByText('Task Hai')).toBeInTheDocument();
  });

  it('should render loading skeletons when isLoading is true (Arrange/Assert)', () => {
    // Arrange: Render với trạng thái isLoading = true
    const { container } = render(
      <TodoList
        todos={[]}
        onToggle={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        isLoading={true}
        isPending={false}
      />
    );

    // Assert: Xác minh có chứa các phần tử skeleton
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render empty state message when list is empty (Arrange/Assert)', () => {
    // Arrange: Render danh sách rỗng
    render(
      <TodoList
        todos={[]}
        onToggle={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        isLoading={false}
        isPending={false}
      />
    );

    // Assert: Đảm bảo hiển thị thông tin cảnh báo danh sách trống
    expect(screen.getByText('Không có công việc nào')).toBeInTheDocument();
    expect(screen.getByText(/Danh sách trống hoặc bộ lọc không khớp/i)).toBeInTheDocument();
  });
});
