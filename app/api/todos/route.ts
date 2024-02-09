import { connectDB } from '@/utils/database';
import { NextRequest, NextResponse } from 'next/server';
import UserTodos from '@/models/userTodos';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

//GET /api/todos
export async function GET(request: NextRequest) {
  await connectDB();
  console.log('attempting to get todos...');
  console.log(request.nextUrl);
  const userId = request.nextUrl.searchParams.get('userId');
  console.log('userId', userId);
  try {
    if (!userId)
      return NextResponse.json(
        { error: 'No user id provided' },
        { status: 400 }
      );
    console.log('made it to find');
    const todos = await UserTodos.find({
      userId: new mongoose.Types.ObjectId(userId),
    });

    console.log('user found');
    return NextResponse.json({
      message:
        todos.length > 0
          ? 'successfully fetched todos'
          : 'this user has no todos: ',
      todos,
    });
  } catch (error) {
    console.error('Error getting todos. ', error);
    return NextResponse.error();
  }
}
// POST /api/todos
export async function POST(request: {
  json: () => Promise<{ userId: mongoose.Types.ObjectId; todo: string }>;
}) {
  console.log('attempting Post');
  await connectDB();
  try {
    const { userId, todo } = await request.json();
    console.log('userId', userId);
    console.log('todo', todo);
    const userTodos = await UserTodos.findOneAndUpdate(
      { userId: userId },
      // $push operator to add the todo to the array
      { $push: { todos: { todo: todo, completed: false } } },
      { new: true, upsert: true }
    );
    return NextResponse.json(userTodos);
  } catch (error) {
    console.error('Error adding todo. ', error);
    return NextResponse.error();
  }
}

// DELETE /api/todo/
export async function DELETE(request: {
  json: () => Promise<{
    userId: mongoose.Types.ObjectId;
    id: mongoose.Types.ObjectId;
  }>;
}) {
  await connectDB();
  try {
    const { userId, id } = await request.json();
    const userTodos = await UserTodos.findOneAndUpdate(
      { userId: userId },
      // $pull operator to remove the todo from the array
      { $pull: { todos: { _id: id } } },
      { new: true }
    );
    if (!userTodos) return NextResponse.error();
    return NextResponse.json(userTodos);
  } catch (error) {
    console.error('Error deleting todo. ', error);
    return NextResponse.error();
  }
}
