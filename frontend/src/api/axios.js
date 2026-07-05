import axios from 'axios';

// Tạo đối tượng Axios instance dùng chung
const api = axios.create({
  // Sử dụng proxy /api đã cấu hình ở vite.config.js để định tuyến về localhost:5000
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Có thể cấu hình thêm các interceptors cho request/response ở đây trong tương lai
// (Ví dụ: tự động gắn Access Token JWT vào Header trước khi gửi request)

export default api;
