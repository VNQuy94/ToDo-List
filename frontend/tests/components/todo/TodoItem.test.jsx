import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TodoItem from '@/components/todo/TodoItem';

describe('TodoItem Component', () => {
  const mockTodo = {
    _id: '123',
    title: 'Học React Testing Library',
    completed: false,
  };

  it('should render todo elements correctly (Arrange/Assert)', () => {
    // Arrange: Render component
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        isPending={false}
      />
    );

    // Assert: Xác minh hiển thị đúng tiêu đề, checkbox và các nút sửa/xóa với nhãn tiếp cận
    expect(screen.getByText('Học React Testing Library')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Chỉnh sửa công việc/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Xóa công việc/i })).toBeInTheDocument();
  });

  it('should trigger onToggle callback when clicking checkbox (Arrange/Act/Assert)', () => {
    const handleToggle = vi.fn();

    // Arrange: Render component
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={handleToggle}
        onEdit={() => {}}
        onDelete={() => {}}
        isPending={false}
      />
    );

    // Act: Nhập chọn checkbox
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Assert: Xác minh callback onToggle được gọi với ID và trạng thái nghịch đảo
    expect(handleToggle).toHaveBeenCalledWith('123', true);
  });

  it('should trigger onEdit callback when clicking edit button (Arrange/Act/Assert)', () => {
    const handleEdit = vi.fn();

    // Arrange: Render component
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={() => {}}
        onEdit={handleEdit}
        onDelete={() => {}}
        isPending={false}
      />
    );

    // Act: Nhấp chọn biểu tượng sửa
    const editButton = screen.getByRole('button', { name: /Chỉnh sửa công việc/i });
    fireEvent.click(editButton);

    // Assert: Xác minh callback onEdit được gọi với đối tượng todo
    expect(handleEdit).toHaveBeenCalledWith(mockTodo);
  });

  it('should trigger onDelete callback when clicking delete button (Arrange/Act/Assert)', () => {
    const handleDelete = vi.fn();

    // Arrange: Render component
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={() => {}}
        onEdit={() => {}}
        onDelete={handleDelete}
        isPending={false}
      />
    );

    // Act: Nhấp chọn biểu tượng xóa
    const deleteButton = screen.getByRole('button', { name: /Xóa công việc/i });
    fireEvent.click(deleteButton);

    // Assert: Xác minh callback onDelete được gọi với ID tương ứng
    expect(handleDelete).toHaveBeenCalledWith('123');
  });

  it('should apply line-through styling if completed is true (Arrange/Assert)', () => {
    const completedTodo = { ...mockTodo, completed: true };

    // Arrange: Render component hoàn thành
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        isPending={false}
      />
    );

    // Assert: Đảm bảo nhãn tiêu đề có class line-through
    const label = screen.getByText('Học React Testing Library');
    expect(label).toHaveClass('line-through');
  });

  it('should disable interaction elements when isPending is true (Arrange/Assert)', () => {
    // Arrange: Render với isPending = true
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        isPending={true}
      />
    );

    // Assert: Khóa checkbox và các nút bấm sửa, xóa
    const checkbox = screen.getByRole('checkbox');
    const editButton = screen.getByRole('button', { name: /Chỉnh sửa công việc/i });
    const deleteButton = screen.getByRole('button', { name: /Xóa công việc/i });

    expect(checkbox).toBeDisabled();
    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });
});
