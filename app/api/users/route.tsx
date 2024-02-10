import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user';
import bcrypt from 'bcrypt';
import { connectDB } from '@/utils/database';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    console.log('attempting to register user...');
    const body = await request.json();
    const { email, password } = body;

    // confirm data exists
    if (!email || !password) {
      return NextResponse.json(
        { error: 'All fields are requiried!' },
        { status: 400 }
      );
    }

    // check dupes
    const dupe = await User.findOne({ email: email });

    if (dupe) {
      return NextResponse.json(
        { error: 'User already exists!' },
        { status: 409 }
      );
    }

    // create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.log('Error registering user: ', error);
    return NextResponse.json(
      { error: 'Error registering user' },
      { status: 500 }
    );
  }
}
