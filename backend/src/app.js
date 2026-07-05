import express from 'express';
import cors from 'cors';

const app = express();

// Cấu hình CORS: Cho phép frontend truy cập theo địa chỉ khai báo trong biến môi trường
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware phân tích cú pháp dữ liệu JSON đầu vào (Request body parser)
app.use(express.json());

// Tuyến đường kiểm tra sức khỏe hệ thống (Health Check Route)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default app;
