import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  todo: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const userTodosSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  todos: [todoSchema],
});

const UserTodos =
  mongoose.models.UserTodos || mongoose.model('UserTodos', userTodosSchema);

export default UserTodos;
