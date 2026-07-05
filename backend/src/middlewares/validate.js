/**
 * Middleware chuyển tiếp kiểm tra dữ liệu yêu cầu bằng Zod Schema.
 * @param {import('zod').ZodSchema} schema - Schema của Zod dùng để kiểm tra
 */
export const validate = (schema) => (req, res, next) => {
  try {
    // Thực hiện kiểm tra dữ liệu đầu vào trên body, query, và params
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Cập nhật lại các trường dữ liệu sạch (được lọc) vào request
    if (parsed.body) req.body = parsed.body;
    
    if (parsed.query) {
      // Xóa các trường cũ và sao chép các trường đã được validate/chuyển kiểu vào req.query
      Object.keys(req.query).forEach((key) => delete req.query[key]);
      Object.assign(req.query, parsed.query);
    }

    if (parsed.params) {
      Object.keys(req.params).forEach((key) => delete req.params[key]);
      Object.assign(req.params, parsed.params);
    }

    next();
  } catch (error) {
    // Chuyển tiếp lỗi ZodError sang middleware xử lý lỗi tập trung
    next(error);
  }
};
