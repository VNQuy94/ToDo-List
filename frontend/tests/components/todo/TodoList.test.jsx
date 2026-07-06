import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TodoList from '@/components/todo/TodoList';

describe('TodoList Component', () => {
  const mockTodos = [
    { _id: '1', title: 'Task One', completed: false },
    { _id: '2', title: 'Task Two', completed: true },
  ];

  it('should render a list of todo items (Arrange/Assert)', () => {
    // Arrange: Render list with 2 todos
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

    // Assert: Verify both titles render
    expect(screen.getByText('Task One')).toBeInTheDocument();
    expect(screen.getByText('Task Two')).toBeInTheDocument();
  });

  it('should render loading skeletons when isLoading is true (Arrange/Assert)', () => {
    // Arrange: Render with isLoading = true
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

    // Assert: Verify skeleton elements are present
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render empty state message when list is empty (Arrange/Assert)', () => {
    // Arrange: Render empty list
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

    // Assert: Verify empty state text displays in English
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
    expect(screen.getByText(/The list is empty or the filter doesn't match/i)).toBeInTheDocument();
  });
});
