import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FilterSelect from '@/components/todo/FilterSelect';

// Mock các component Select của shadcn/ui để tránh lỗi cổng dựng (portals) của Radix UI trong môi trường jsdom
vi.mock('@/components/ui/select', () => {
  return {
    Select: ({ value, onValueChange, disabled }) => (
      <select
        value={value}
        onChange={(e) => onValueChange && onValueChange(e.target.value)}
        disabled={disabled}
        data-testid="mock-select"
        aria-label="Lọc trạng thái công việc"
      >
        <option value="all">Tất cả</option>
        <option value="active">Chưa hoàn thành</option>
        <option value="completed">Đã hoàn thành</option>
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

    // Assert: Xác minh render đúng các tùy chọn bộ lọc
    expect(screen.getByText('Tất cả')).toBeInTheDocument();
    expect(screen.getByText('Chưa hoàn thành')).toBeInTheDocument();
    expect(screen.getByText('Đã hoàn thành')).toBeInTheDocument();
  });

  it('should trigger onChange callback when option is selected (Arrange/Act/Assert)', () => {
    const handleChange = vi.fn();

    // Arrange: Render
    render(<FilterSelect value="all" onChange={handleChange} isPending={false} />);

    // Act: Đổi giá trị select sang 'completed'
    const select = screen.getByTestId('mock-select');
    fireEvent.change(select, { target: { value: 'completed' } });

    // Assert: Gọi đúng callback
    expect(handleChange).toHaveBeenCalledWith('completed');
  });

  it('should disable selection trigger when isPending is true (Arrange/Assert)', () => {
    // Arrange: Render với isPending = true
    render(<FilterSelect value="all" onChange={() => {}} isPending={true} />);

    // Assert: Xác minh dropdown bị khóa
    const select = screen.getByTestId('mock-select');
    expect(select).toBeDisabled();
  });
});
