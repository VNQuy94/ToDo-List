import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from '@/components/todo/SearchBar';

describe('SearchBar Component', () => {
  it('should render search input correctly (Arrange/Assert)', () => {
    // Arrange: Render component
    render(<SearchBar value="" onChange={() => {}} />);

    // Assert: Xác minh ô tìm kiếm và nhãn tiếp cận hiển thị chuẩn
    expect(screen.getByLabelText('Tìm kiếm công việc')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tìm kiếm công việc/i)).toBeInTheDocument();
  });

  it('should trigger onChange callback when user types (Arrange/Act/Assert)', () => {
    const handleChange = vi.fn();

    // Arrange: Render component
    render(<SearchBar value="" onChange={handleChange} />);

    // Act: Nhập nội dung tìm kiếm
    const input = screen.getByPlaceholderText(/Tìm kiếm công việc/i);
    fireEvent.change(input, { target: { value: 'Lau nhà' } });

    // Assert: Xác minh callback truyền đúng ký tự
    expect(handleChange).toHaveBeenCalledWith('Lau nhà');
  });
});
