import { beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Đảm bảo biến môi trường đã được nạp
dotenv.config();

beforeAll(async () => {
  let uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI chưa được cấu hình trong tệp .env!');
  }

  // Tách biệt database test để không làm bẩn cơ sở dữ liệu phát triển (todo_db)
  if (uri.includes('/todo_db?')) {
    uri = uri.replace('/todo_db?', '/todo_db_test?');
  } else if (uri.endsWith('/todo_db')) {
    uri = uri.replace('/todo_db', '/todo_db_test');
  }

  // Kết nối tới database test
  await mongoose.connect(uri);
});

beforeEach(async () => {
  // Xóa sạch dữ liệu trong các collection trước mỗi case test để đảm bảo tính độc lập
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  // Đóng kết nối sau khi tất cả các bài test kết thúc
  await mongoose.connection.close();
});
