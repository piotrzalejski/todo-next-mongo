import UserTodos from '@/models/userTodos';
import { connectDB } from '@/utils/database';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function PUT(
  request: {
    json: () => Promise<{
      userId: mongoose.Types.ObjectId;
      todo: string;
      completed: boolean;
    }>;
  },
  { params }: { params: { todoId: string } }
) {
  await connectDB();
  console.log('attempting to update todo...');
  try {
    const id = params.todoId;
    console.log('request: ', request);
    const { userId, todo, completed } = await request.json();

    // Use findOneAndUpdate to directly update the document based on its _id
    const updatedTodo = await UserTodos.findOneAndUpdate(
      { userId: userId, 'todos._id': id },
      { $set: { 'todos.$.todo': todo, 'todos.$.completed': completed } }, //
      { new: true } // Return the updated document after the update
    );

    // Find the updated todo within the todos array
    const updatedTodoItem = updatedTodo.todos.find(
      (item: {
        _id: mongoose.Types.ObjectId;
        todo: string;
        completed: boolean;
      }) => item._id.equals(id)
    );

    console.log('updatedTodo: ', updatedTodoItem);
    return NextResponse.json({
      message: 'Updated todo successfully.',
      updatedTodo: updatedTodoItem,
    });
  } catch (error) {
    console.error('Error updating todo. ', error);
    return NextResponse.error();
  }
}
