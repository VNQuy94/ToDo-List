import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Tự động dọn dẹp DOM sau mỗi test case để tránh rò rỉ state UI
afterEach(() => {
  cleanup();
});
