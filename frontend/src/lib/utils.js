import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Hàm tiện ích kết hợp các lớp class CSS của Tailwind một cách thông minh,
 * giải quyết các xung đột ghi đè class.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
