import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TodoItem from '@/components/todo/TodoItem';

describe('TodoItem Component', () => {
  const mockTodo = {
    _id: '123',
    title: 'Learn React Testing Library',
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

    // Assert: Verify title, checkbox, and action buttons are present with correct aria-labels
    expect(screen.getByText('Learn React Testing Library')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Edit task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete task/i })).toBeInTheDocument();
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

    // Act: Click checkbox
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Assert: Verify onToggle triggers with ID and boolean value
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

    // Act: Click edit button
    const editButton = screen.getByRole('button', { name: /Edit task/i });
    fireEvent.click(editButton);

    // Assert: Verify onEdit triggers with todo object
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

    // Act: Click delete button
    const deleteButton = screen.getByRole('button', { name: /Delete task/i });
    fireEvent.click(deleteButton);

    // Assert: Verify onDelete triggers with ID
    expect(handleDelete).toHaveBeenCalledWith('123');
  });

  it('should apply line-through styling if completed is true (Arrange/Assert)', () => {
    const completedTodo = { ...mockTodo, completed: true };

    // Arrange: Render completed item
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        isPending={false}
      />
    );

    // Assert: Verify line-through styling
    const label = screen.getByText('Learn React Testing Library');
    expect(label).toHaveClass('line-through');
  });

  it('should disable interaction elements when isPending is true (Arrange/Assert)', () => {
    // Arrange: Render with isPending = true
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        isPending={true}
      />
    );

    // Assert: Verify inputs and buttons are disabled
    const checkbox = screen.getByRole('checkbox');
    const editButton = screen.getByRole('button', { name: /Edit task/i });
    const deleteButton = screen.getByRole('button', { name: /Delete task/i });

    expect(checkbox).toBeDisabled();
    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });
});
