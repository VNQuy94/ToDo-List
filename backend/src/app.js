import express from 'express';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import todoRouter from './routes/todo.routes.js';
import { errorHandler } from './middlewares/error.js';
import { AppError } from './utils/appError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc tệp cấu hình Swagger JSON
const swaggerDocument = JSON.parse(
  readFileSync(path.resolve(__dirname, './swagger.json'), 'utf8')
);

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

// Tuyến đường tài liệu API Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Đăng ký API Routes
app.use('/api/todos', todoRouter);

// Xử lý các tuyến đường không tồn tại (404 Not Found)
app.use((req, res, next) => {
  next(new AppError(`Không tìm thấy tuyến đường ${req.originalUrl} trên máy chủ.`, 404));
});

// Đăng ký Middleware xử lý lỗi tập trung ở cuối cùng
app.use(errorHandler);

export default app;
