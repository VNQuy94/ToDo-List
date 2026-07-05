import { z } from 'zod';

/**
 * Định nghĩa Schema kiểm định dữ liệu Todo ở phía Frontend sử dụng Zod.
 * Đồng bộ các điều kiện với Backend (độ dài 3-100 ký tự).
 */
export const todoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Tiêu đề công việc không được để trống.' })
    .min(3, { message: 'Tiêu đề phải chứa ít nhất 3 ký tự.' })
    .max(100, { message: 'Tiêu đề không được vượt quá 100 ký tự.' }),
});
