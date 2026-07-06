import './setup.js';
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import Todo from '../src/models/todo.js';

describe('Todo API Integration Tests', () => {
  
  describe('POST /api/todos', () => {
    it('should create a todo successfully with valid data', async () => {
      const payload = { title: 'Learn Backend Development' };
      
      const res = await request(app)
        .post('/api/todos')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(payload.title);
      expect(res.body.data.completed).toBe(false);
      expect(res.body.data).toHaveProperty('_id');
      
      const todoInDb = await Todo.findById(res.body.data._id);
      expect(todoInDb).not.toBeNull();
      expect(todoInDb.title).toBe(payload.title);
    });

    it('should return 400 if title is too short (under 3 characters)', async () => {
      const payload = { title: 'Ab' };

      const res = await request(app)
        .post('/api/todos')
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.status).toBe('fail');
      expect(res.body.errors[0].field).toBe('body.title');
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/todos', () => {
    it('should return an empty list if no data exists', async () => {
      const res = await request(app).get('/api/todos');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination.totalItems).toBe(0);
    });

    it('should filter and paginate correctly', async () => {
      await Todo.create([
        { title: 'Learn Node.js', completed: true },
        { title: 'Learn React', completed: false },
        { title: 'Go running', completed: false }
      ]);

      const resFilter = await request(app)
        .get('/api/todos')
        .query({ completed: 'false' });

      expect(resFilter.status).toBe(200);
      expect(resFilter.body.data.length).toBe(2);
      expect(resFilter.body.pagination.totalItems).toBe(2);

      const resSearch = await request(app)
        .get('/api/todos')
        .query({ search: 'Learn' });

      expect(resSearch.status).toBe(200);
      expect(resSearch.body.data.length).toBe(2);

      const resPage = await request(app)
        .get('/api/todos')
        .query({ page: 2, limit: 2 });

      expect(resPage.status).toBe(200);
      expect(resPage.body.data.length).toBe(1);
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update a todo successfully with valid ID and data', async () => {
      const todo = await Todo.create({ title: 'Buy groceries' });

      const res = await request(app)
        .put(`/api/todos/${todo._id}`)
        .send({ completed: true, title: 'Buy groceries at supermarket' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.completed).toBe(true);
      expect(res.body.data.title).toBe('Buy groceries at supermarket');

      const updatedTodoInDb = await Todo.findById(todo._id);
      expect(updatedTodoInDb.completed).toBe(true);
    });

    it('should return 404 if ID is not found', async () => {
      const nonExistentId = '111111111111111111111111';
      const res = await request(app)
        .put(`/api/todos/${nonExistentId}`)
        .send({ completed: true });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Todo not found');
    });

    it('should return 400 if ID is invalid format', async () => {
      const res = await request(app)
        .put('/api/todos/invalid_id_format')
        .send({ completed: true });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo successfully with valid ID', async () => {
      const todo = await Todo.create({ title: 'Homework' });

      const res = await request(app).delete(`/api/todos/${todo._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(todo._id.toString());

      const deletedInDb = await Todo.findById(todo._id);
      expect(deletedInDb).toBeNull();
    });

    it('should return 404 if ID is not found', async () => {
      const nonExistentId = '222222222222222222222222';
      const res = await request(app).delete(`/api/todos/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
