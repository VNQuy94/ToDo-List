import { ZodError } from 'zod';

/**
 * Middleware xử lý lỗi tập trung cho toàn bộ ứng dụng Express.
 */
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 1. Xử lý lỗi validate dữ liệu đầu vào của Zod
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      status: 'fail',
      message: 'Dữ liệu yêu cầu gửi lên không hợp lệ.',
      errors: formattedErrors,
    });
  }

  // 2. Xử lý lỗi Mongoose CastError (ví dụ: ID truyền lên không đúng định dạng ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      status: 'fail',
      message: `Giá trị '${err.value}' của trường '${err.path}' không hợp lệ.`,
    });
  }

  // 3. Xử lý lỗi Validate của Mongoose ở tầng Database
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((el) => el.message);
    return res.status(400).json({
      success: false,
      status: 'fail',
      message: 'Lỗi kiểm tra dữ liệu cơ sở dữ liệu.',
      errors: messages,
    });
  }

  // 4. Xử lý lỗi nghiệp vụ được định nghĩa chủ động (AppError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // 5. Ghi nhận lỗi hệ thống lạ (Programming errors) và trả về lỗi 500
  console.error('[Lỗi Hệ Thống Không Xác Định]:', err);

  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'Đã xảy ra lỗi hệ thống bất ngờ. Vui lòng thử lại sau!',
  });
};
