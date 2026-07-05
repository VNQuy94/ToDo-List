import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TodoForm from '@/components/todo/TodoForm';

describe('TodoForm Component', () => {
  it('should render form elements correctly (Arrange/Assert)', () => {
    // Arrange: Render component với giá trị trống
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

    // Assert: Xác minh các phần tử giao diện tồn tại đúng nhãn tiếp cận
    expect(screen.getByLabelText('Thêm việc mới')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Thêm công việc mới/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Thêm/i })).toBeInTheDocument();
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

    // Act: Nhập nội dung vào Input
    const input = screen.getByPlaceholderText(/Thêm công việc mới/i);
    fireEvent.change(input, { target: { value: 'Học React 19' } });

    // Assert: Đảm bảo callback onChange được kích hoạt với tham số chính xác
    expect(handleChange).toHaveBeenCalledWith('Học React 19');
  });

  it('should trigger onSubmit callback on form submit (Arrange/Act/Assert)', () => {
    const handleSubmit = vi.fn();

    // Arrange: Render với tiêu đề hợp lệ (dài >= 3 ký tự)
    render(
      <TodoForm
        value="Học React 19"
        onChange={() => {}}
        onSubmit={handleSubmit}
        isCreating={false}
        isPending={false}
        error={null}
      />
    );

    // Act: Click nút Thêm
    const submitButton = screen.getByRole('button', { name: /Thêm/i });
    fireEvent.click(submitButton);

    // Assert: Xác minh callback onSubmit được gọi
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('should disable inputs and show spinner when isPending is true (Arrange/Assert)', () => {
    // Arrange: Render với trạng thái isPending = true
    render(
      <TodoForm
        value="Học React 19"
        onChange={() => {}}
        onSubmit={() => {}}
        isCreating={true}
        isPending={true}
        error={null}
      />
    );

    // Assert: Đảm bảo ô input bị khóa và nút bấm chuyển sang trạng thái "Đang thêm..."
    const input = screen.getByPlaceholderText(/Thêm công việc mới/i);
    const submitButton = screen.getByRole('button', { name: /Đang thêm.../i });

    expect(input).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('should display error message when validation fails (Arrange/Assert)', () => {
    const errorMessage = 'Tiêu đề phải chứa ít nhất 3 ký tự.';

    // Arrange: Render với prop error
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

    // Assert: Xác minh tin nhắn lỗi hiển thị đúng trên giao diện
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
