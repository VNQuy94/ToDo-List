import React from 'react';
import AppLayout from './components/layout/AppLayout';
import TodoPage from '@/pages/TodoPage';
import { Toaster } from '@/components/ui/sonner';

// Main App entrypoint
export default function App() {
  return (
    <AppLayout>
      <TodoPage />
      <Toaster richColors position="top-right" closeButton />
    </AppLayout>
  );
}
