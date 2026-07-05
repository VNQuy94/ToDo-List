import React from 'react';

/**
 * Bố cục tổng thể (AppLayout) định dạng giao diện cao cấp.
 * Sử dụng gam màu vàng kim kết hợp màu nền ấm áp tinh tế.
 */
export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
      {/* Header sang trọng với đường viền mảnh phía dưới */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
        <div className="container max-w-4xl mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            {/* Logo hoặc biểu tượng thương hiệu mạ vàng */}
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TO DO LIST
            </span>
          </div>
        </div>
      </header>

      {/* Thân ứng dụng chứa phần nội dung động */}
      <main className="flex-1 container max-w-4xl mx-auto py-8 px-4">
        {children}
      </main>

      {/* Chân trang tối giản */}
      <footer className="border-t border-border py-6" style={{ backgroundColor: '#ed1e24e3', opacity: 0.8 }}>
        <div className="container max-w-4xl mx-auto flex items-center justify-center px-4">
          <p className="text-center text-xs font-semibold text-white tracking-wide">
            &copy; {new Date().getFullYear()} VNQuy94. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
