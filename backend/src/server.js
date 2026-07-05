import dotenv from 'dotenv';
// Nạp biến môi trường từ tệp .env ngay dòng đầu tiên
// Điều này đảm bảo tất cả các file được import phía sau đều có thể truy cập các biến này ngay khi load
dotenv.config();

import app from './app.js';
import { connectDB } from './config/database.js';

const PORT = process.env.PORT || 5000;

/**
 * Khởi động ứng dụng.
 * Theo quy trình tốt nhất: Chỉ start server Express lắng nghe các kết nối HTTP 
 * sau khi đã thiết lập thành công kết nối tới cơ sở dữ liệu MongoDB.
 */
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[Server] Máy chủ đang chạy ở chế độ [${process.env.NODE_ENV || 'development'}] trên cổng ${PORT}`);
  });
};

startServer();
