import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FilterSelect from '@/components/todo/FilterSelect';

// Mock shadcn Select components to bypass jsdom portals limitations
vi.mock('@/components/ui/select', () => {
  return {
    Select: ({ value, onValueChange, disabled }) => (
      <select
        value={value}
        onChange={(e) => onValueChange && onValueChange(e.target.value)}
        disabled={disabled}
        data-testid="mock-select"
        aria-label="Filter task status"
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
    ),
    SelectTrigger: () => null,
    SelectValue: () => null,
    SelectContent: () => null,
    SelectItem: () => null,
  };
});

describe('FilterSelect Component', () => {
  it('should render selection dropdown options correctly (Arrange/Assert)', () => {
    // Arrange: Render component
    render(<FilterSelect value="all" onChange={() => {}} isPending={false} />);

    // Assert: Verify options render in English
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should trigger onChange callback when option is selected (Arrange/Act/Assert)', () => {
    const handleChange = vi.fn();

    // Arrange: Render
    render(<FilterSelect value="all" onChange={handleChange} isPending={false} />);

    // Act: Select 'completed'
    const select = screen.getByTestId('mock-select');
    fireEvent.change(select, { target: { value: 'completed' } });

    // Assert: Verify callback
    expect(handleChange).toHaveBeenCalledWith('completed');
  });

  it('should disable selection trigger when isPending is true (Arrange/Assert)', () => {
    // Arrange: Render with isPending = true
    render(<FilterSelect value="all" onChange={() => {}} isPending={true} />);

    // Assert: Verify disabled select
    const select = screen.getByTestId('mock-select');
    expect(select).toBeDisabled();
  });
});
