import React from 'react';
import AppLayout from './components/layout/AppLayout';
import TodoPage from '@/pages/TodoPage';
import { Toaster } from '@/components/ui/sonner';

/**
 * Điểm lắp ghép chính của ứng dụng Frontend.
 * Đóng vai trò hiển thị trang TodoPage bên trong Layout cấu hình sẵn, có Toast thông báo.
 */
export default function App() {
  return (
    <AppLayout>
      <TodoPage />
      <Toaster richColors position="top-right" closeButton />
    </AppLayout>
  );
}
