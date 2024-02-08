import { NextResponse } from 'next/server';
import User from '@/models/user';
import bcrypt from 'bcrypt';

export async function POST(request: {
  json: () => Promise<{ email: string; password: string }>;
}) {
  try {
    const { email, password } = await request.json();
    console.log('email', email);

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
