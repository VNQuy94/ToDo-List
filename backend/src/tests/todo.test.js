import './setup.js'; // Nạp database test lifecycle hooks
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import Todo from '../models/todo.js';

describe('Todo API Integration Tests', () => {
  
  describe('POST /api/todos (Tạo mới Todo)', () => {
    it('sẽ tạo mới thành công nếu dữ liệu hợp lệ', async () => {
      const payload = { title: 'Học lập trình Backend' };
      
      const res = await request(app)
        .post('/api/todos')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(payload.title);
      expect(res.body.data.completed).toBe(false);
      expect(res.body.data).toHaveProperty('_id');
      
      // Kiểm tra DB lưu trữ thực tế
      const todoInDb = await Todo.findById(res.body.data._id);
      expect(todoInDb).not.toBeNull();
      expect(todoInDb.title).toBe(payload.title);
    });

    it('sẽ trả về lỗi 400 nếu tiêu đề quá ngắn (dưới 3 ký tự)', async () => {
      const payload = { title: 'Ab' };

      const res = await request(app)
        .post('/api/todos')
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.status).toBe('fail');
      expect(res.body.errors[0].field).toBe('body.title');
    });

    it('sẽ trả về lỗi 400 nếu thiếu tiêu đề', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/todos (Lấy danh sách Todos)', () => {
    it('sẽ trả về mảng rỗng nếu chưa có dữ liệu', async () => {
      const res = await request(app).get('/api/todos');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination.totalItems).toBe(0);
    });

    it('sẽ lọc và phân trang chính xác', async () => {
      // Seed data
      await Todo.create([
        { title: 'Học bài Node.js', completed: true },
        { title: 'Học bài React', completed: false },
        { title: 'Đi chạy bộ', completed: false }
      ]);

      // Lọc theo completed=false
      const resFilter = await request(app)
        .get('/api/todos')
        .query({ completed: 'false' });

      expect(resFilter.status).toBe(200);
      expect(resFilter.body.data.length).toBe(2);
      expect(resFilter.body.pagination.totalItems).toBe(2);

      // Tìm kiếm theo từ khóa 'bài'
      const resSearch = await request(app)
        .get('/api/todos')
        .query({ search: 'bài' });

      expect(resSearch.status).toBe(200);
      expect(resSearch.body.data.length).toBe(2);

      // Phân trang
      const resPage = await request(app)
        .get('/api/todos')
        .query({ page: 2, limit: 2 });

      expect(resPage.status).toBe(200);
      expect(resPage.body.data.length).toBe(1); // tổng 3, trang 1 lấy 2, trang 2 lấy 1
    });
  });

  describe('PUT /api/todos/:id (Cập nhật Todo)', () => {
    it('sẽ cập nhật thành công nếu ID và dữ liệu hợp lệ', async () => {
      const todo = await Todo.create({ title: 'Đi mua đồ ăn' });

      const res = await request(app)
        .put(`/api/todos/${todo._id}`)
        .send({ completed: true, title: 'Đi siêu thị mua đồ ăn' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.completed).toBe(true);
      expect(res.body.data.title).toBe('Đi siêu thị mua đồ ăn');

      const updatedTodoInDb = await Todo.findById(todo._id);
      expect(updatedTodoInDb.completed).toBe(true);
    });

    it('sẽ báo lỗi 404 nếu không tìm thấy ID', async () => {
      const nonExistentId = '111111111111111111111111';
      const res = await request(app)
        .put(`/api/todos/${nonExistentId}`)
        .send({ completed: true });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Không tìm thấy Todo');
    });

    it('sẽ báo lỗi 400 nếu truyền ID sai định dạng', async () => {
      const res = await request(app)
        .put('/api/todos/id_sai_dinh_dang')
        .send({ completed: true });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('không hợp lệ');
    });
  });

  describe('DELETE /api/todos/:id (Xóa Todo)', () => {
    it('sẽ xóa thành công Todo nếu ID hợp lệ', async () => {
      const todo = await Todo.create({ title: 'Bài tập về nhà' });

      const res = await request(app).delete(`/api/todos/${todo._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.id).toBe(todo._id.toString());

      const deletedInDb = await Todo.findById(todo._id);
      expect(deletedInDb).toBeNull();
    });

    it('sẽ báo lỗi 404 nếu không tìm thấy ID', async () => {
      const nonExistentId = '222222222222222222222222';
      const res = await request(app).delete(`/api/todos/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

});
