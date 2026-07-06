import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TodoForm from '@/components/todo/TodoForm';

describe('TodoForm Component', () => {
  it('should render form elements correctly (Arrange/Assert)', () => {
    // Arrange: Render component with empty value
    render(
      <TodoForm
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        isCreating={false}
        isPending={false}
        error={null}
      />
    );

    // Assert: Verify UI elements and accessibility labels
    expect(screen.getByLabelText('Add new task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Add a new task/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
  });

  it('should trigger onChange callback when typing (Arrange/Act/Assert)', () => {
    const handleChange = vi.fn();
    
    // Arrange: Render component
    render(
      <TodoForm
        value=""
        onChange={handleChange}
        onSubmit={() => {}}
        isCreating={false}
        isPending={false}
        error={null}
      />
    );

    // Act: Type inside Input
    const input = screen.getByPlaceholderText(/Add a new task/i);
    fireEvent.change(input, { target: { value: 'Learn React 19' } });

    // Assert: Verify callback onChange triggers correctly
    expect(handleChange).toHaveBeenCalledWith('Learn React 19');
  });

  it('should trigger onSubmit callback on form submit (Arrange/Act/Assert)', () => {
    const handleSubmit = vi.fn();

    // Arrange: Render with valid value (>= 3 characters)
    render(
      <TodoForm
        value="Learn React 19"
        onChange={() => {}}
        onSubmit={handleSubmit}
        isCreating={false}
        isPending={false}
        error={null}
      />
    );

    // Act: Click submit button
    const submitButton = screen.getByRole('button', { name: /Add/i });
    fireEvent.click(submitButton);

    // Assert: Verify onSubmit triggers
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('should disable inputs and show spinner when isPending is true (Arrange/Assert)', () => {
    // Arrange: Render with isPending = true
    render(
      <TodoForm
        value="Learn React 19"
        onChange={() => {}}
        onSubmit={() => {}}
        isCreating={true}
        isPending={true}
        error={null}
      />
    );

    // Assert: Verify inputs disabled and button text shows spinner state
    const input = screen.getByPlaceholderText(/Add a new task/i);
    const submitButton = screen.getByRole('button', { name: /Adding.../i });

    expect(input).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('should display error message when validation fails (Arrange/Assert)', () => {
    const errorMessage = 'Title must be at least 3 characters long.';

    // Arrange: Render with error prop
    render(
      <TodoForm
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        isCreating={false}
        isPending={false}
        error={errorMessage}
      />
    );

    // Assert: Verify error text is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
