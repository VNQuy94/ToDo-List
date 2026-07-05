import { z } from 'zod';

// Regex kiểm tra định dạng ObjectId (24 ký tự hệ thập lục phân)
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

/**
 * Schema kiểm tra dữ liệu khi tạo mới Todo.
 */
export const createTodoSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Tiêu đề Todo là bắt buộc.',
      })
      .trim()
      .min(3, { message: 'Tiêu đề phải chứa ít nhất 3 ký tự.' })
      .max(100, { message: 'Tiêu đề không được vượt quá 100 ký tự.' }),
  }),
});

/**
 * Schema kiểm tra dữ liệu khi cập nhật Todo.
 */
export const updateTodoSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, { message: 'Mã ID của Todo không hợp lệ.' }),
  }),
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(3, { message: 'Tiêu đề phải chứa ít nhất 3 ký tự.' })
        .max(100, { message: 'Tiêu đề không được vượt quá 100 ký tự.' })
        .optional(),
      completed: z
        .boolean({
          invalid_type_error: 'Trạng thái completed phải là true hoặc false.',
        })
        .optional(),
    })
    .refine((data) => data.title !== undefined || data.completed !== undefined, {
      message: 'Bạn phải cập nhật tiêu đề hoặc trạng thái completed.',
    }),
});

/**
 * Schema kiểm tra ID khi xóa Todo.
 */
export const deleteTodoSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, { message: 'Mã ID của Todo không hợp lệ.' }),
  }),
});

/**
 * Schema kiểm tra dữ liệu query parameters khi lấy danh sách Todo (có phân trang và tìm kiếm).
 */
export const getTodosSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    // Chuyển đổi kiểu dữ liệu query string 'true'/'false' sang Boolean thực tế
    completed: z.preprocess((val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      return undefined;
    }, z.boolean().optional()),
    // Chuyển đổi kiểu dữ liệu query string sang Number thực tế
    page: z.preprocess((val) => (val ? parseInt(val, 10) : undefined), z.number().int().positive().optional()),
    limit: z.preprocess((val) => (val ? parseInt(val, 10) : undefined), z.number().int().positive().optional()),
  }),
});
