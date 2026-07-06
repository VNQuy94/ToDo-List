import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from '@/components/todo/SearchBar';

describe('SearchBar Component', () => {
  it('should render search input correctly (Arrange/Assert)', () => {
    // Arrange: Render component
    render(<SearchBar value="" onChange={() => {}} />);

    // Assert: Verify search input and accessibility label
    expect(screen.getByLabelText('Search tasks')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search tasks/i)).toBeInTheDocument();
  });

  it('should trigger onChange callback when user types (Arrange/Act/Assert)', () => {
    const handleChange = vi.fn();

    // Arrange: Render component
    render(<SearchBar value="" onChange={handleChange} />);

    // Act: Type search query
    const input = screen.getByPlaceholderText(/Search tasks/i);
    fireEvent.change(input, { target: { value: 'Clean room' } });

    // Assert: Verify callback
    expect(handleChange).toHaveBeenCalledWith('Clean room');
  });
});
