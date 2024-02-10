import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/utils/database';
import User from '@/models/user';
import bcrypt from 'bcrypt';
import { SessionUser } from '@/lib/types';
import { NextResponse } from 'next/server';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error('Missing credentials');
        }
        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            console.log(`User: ${credentials.email} not found.`);
            throw new Error('User not found');
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            console.log(`Incorrect password for user: ${credentials.email}`);
            throw new Error('Incorrect password');
          }
          return user;
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session && session.user) {
        const sessionUser = await User.findOne({
          email: session.user.email,
        });

        (session.user as SessionUser).id = sessionUser?._id.toString();
      }

      return session;
    },
  },
};
