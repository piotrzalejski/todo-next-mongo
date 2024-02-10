import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/utils/database';
import User from '@/models/user';
import bcrypt from 'bcrypt';
import { SessionUser } from '@/lib/types';

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
          return null;
        }
        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email });

          if (
            user &&
            (await bcrypt.compare(credentials.password, user.password))
          ) {
            return user;
          }

          if (!user) {
            console.log(`User: ${credentials.email} not found.`);
          } else {
            console.log(`Incorrect password for user: ${credentials.email}`);
          }
          return null;
        } catch (error) {
          console.log('Error authorizing user: ', error);
          return null;
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
