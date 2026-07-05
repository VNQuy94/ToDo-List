import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề của Todo là bắt buộc'],
      trim: true,
      minlength: [3, 'Tiêu đề phải có ít nhất 3 ký tự'],
      maxlength: [100, 'Tiêu đề không được vượt quá 100 ký tự'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
