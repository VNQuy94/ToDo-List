/**
 * Lớp lỗi tùy chỉnh phục vụ cho việc ném lỗi nghiệp vụ (operational errors)
 * kèm mã trạng thái HTTP tương ứng.
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Phân biệt lỗi nghiệp vụ với lỗi lập trình hệ thống

    Error.captureStackTrace(this, this.constructor);
  }
}
