import { ZodError } from 'zod';

// Global centralized error handling middleware
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 1. Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      status: 'fail',
      message: 'Invalid request data.',
      errors: formattedErrors,
    });
  }

  // 2. Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      status: 'fail',
      message: `Invalid value '${err.value}' for field '${err.path}'.`,
    });
  }

  // 3. Mongoose Validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((el) => el.message);
    return res.status(400).json({
      success: false,
      status: 'fail',
      message: 'Database validation error.',
      errors: messages,
    });
  }

  // 4. Known operational business errors (AppError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // 5. Unhandled system programming errors
  console.error('[Unhandled System Error]:', err);

  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'An unexpected system error occurred. Please try again later!',
  });
};
