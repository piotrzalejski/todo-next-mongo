import { connectDB } from '@/utils/database';
import { NextRequest, NextResponse } from 'next/server';
import UserTodos from '@/models/userTodos';
import mongoose from 'mongoose';

//GET /api/todos
export async function GET(request: NextRequest) {
  await connectDB();
  console.log('attempting GET...');
  //console.log(request.nextUrl);
  const userId = request.nextUrl.searchParams.get('userId');
  //console.log('userId', userId);
  try {
    if (!userId)
      return NextResponse.json(
        { error: 'Server: No user id provided' },
        { status: 400 }
      );
    const todos = await UserTodos.find({
      userId: new mongoose.Types.ObjectId(userId),
    });

    console.log('GET successful');
    return NextResponse.json(
      {
        message:
          todos.length > 0
            ? 'successfully fetched todos'
            : 'this user has no todos: ',
        todos,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server: Error getting todos. ', error);
    return NextResponse.error();
  }
}
// POST /api/todos
export async function POST(request: {
  json: () => Promise<{ userId: mongoose.Types.ObjectId; todo: string }>;
}) {
  await connectDB();
  console.log('attempting POST...');
  try {
    const { userId, todo } = await request.json();
    // console.log('userId', userId);
    // console.log('todo', todo);
    const userTodos = await UserTodos.findOneAndUpdate(
      { userId: userId },
      // $push operator to add the todo to the array
      { $push: { todos: { todo: todo, completed: false } } },
      { new: true, upsert: true }
    );
    console.log('POST successful');
    return NextResponse.json(
      { message: 'Server: Todo has been added.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Server: Error adding todo. ', error);
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
  console.log('attempting DELETE...');
  try {
    const { userId, id } = await request.json();
    const userTodos = await UserTodos.findOneAndUpdate(
      { userId: userId },
      // $pull operator to remove the todo from the array
      { $pull: { todos: { _id: id } } },
      { new: true }
    );
    if (!userTodos) return NextResponse.error();
    console.log('DELETE successful');
    return NextResponse.json(
      { message: 'Server: Todo successfully deleted.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server: Error deleting todo. ', error);
    return NextResponse.error();
  }
}
