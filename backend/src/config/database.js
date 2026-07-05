import mongoose from 'mongoose';

/**
 * Khởi tạo kết nối tới cơ sở dữ liệu MongoDB bằng Mongoose.
 * Tiến trình sẽ dừng lại (exit) nếu kết nối ban đầu thất bại.
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI chưa được định nghĩa trong biến môi trường!');
    }

    // Cấu hình Mongoose theo tiêu chuẩn tốt nhất (2026):
    // - autoIndex: Chỉ bật ở môi trường phát triển (development). Ở môi trường production,
    //   tự động tạo index có thể gây nghẽn hiệu năng nghiêm trọng cho DB lớn. Thay vào đó,
    //   index nên được tạo thủ công hoặc qua các script migration riêng.
    mongoose.set('autoIndex', process.env.NODE_ENV === 'development');

    // Các tùy chọn cũ như useNewUrlParser và useUnifiedTopology đã lỗi thời (deprecated)
    // trong các phiên bản Mongoose/MongoDB Driver mới và không còn tác dụng, do đó ta bỏ qua.
    const conn = await mongoose.connect(mongoUri);

    console.log(`[Database] Kết nối MongoDB thành công: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Lỗi kết nối MongoDB: ${error.message}`);
    // Thoát tiến trình ngay lập tức nếu kết nối ban đầu thất bại
    process.exit(1);
  }
};
