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
              ANTIGRAVITY TODO
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary-hover border border-primary/20">
              V1.0.0
            </span>
          </div>
        </div>
      </header>

      {/* Thân ứng dụng chứa phần nội dung động */}
      <main className="flex-1 container max-w-4xl mx-auto py-8 px-4">
        {children}
      </main>

      {/* Chân trang tối giản */}
      <footer className="border-t border-border bg-white py-6">
        <div className="container max-w-4xl mx-auto flex flex-col items-center justify-between gap-4 md:h-12 md:flex-row md:py-0 px-4">
          <p className="text-center text-xs leading-loose text-muted-foreground md:text-left">
            Built with React 19, Vite, Tailwind CSS & shadcn/ui.
          </p>
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} VNQuy94. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
