'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type SignInResponse = {
  error?: string;
  ok?: boolean;
  status: number;
};

export default function CredentialsForm() {
  const isRegister = usePathname() === '/register';
  const router = useRouter();

  const handleSignInSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const signInResponse = (await signIn('credentials', {
      email: data.get('email') as string,
      password: data.get('password') as string,
      redirect: false,
    })) as SignInResponse;

    if (signInResponse && signInResponse.ok) {
      router.push('/');
    } else {
      console.error(
        `
     Status: ${signInResponse.status} 
     Error: ${signInResponse.error}`
      );
      toast.error(`Error: ${signInResponse.error}`);
    }
  };

  const handleRegiserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('registering...');
    const data = new FormData(e.currentTarget);
    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        email: data.get('email'),
        password: data.get('password'),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 409) {
      toast.error('User already exists with that email!');
      return console.error('User already exists');
    } else if (!res.ok) {
      toast.error('Error registering user');
      return console.error('Error registering user');
    } else {
      console.log(`User ${data.get('email')} registered successfully`);
      toast.success(`Registered Succesfully \n Please login.`, {
        className: 'bg-[#713200] text-[#FFFAEE] border-[#FFFAEE] text-center',
        iconTheme: {
          primary: '#713200',
          secondary: '#FFFAEE',
        },
      });
      router.push('/login');
    }
  };
  return (
    <form
      className='flex flex-col gap-4 justify-center items-center min-h-screen py-2 text-center'
      onSubmit={isRegister ? handleRegiserSubmit : handleSignInSubmit}
    >
      <h1 className='text-4xl font-bold mt-10'>
        {isRegister ? 'Register an account' : 'Login'}
      </h1>
      <div className='flex flex-col items-center shadow-md gap-2 max-w-[350px]'>
        <Input
          name='email'
          placeholder='Email'
          type='email'
          autoComplete='email'
          required
          className='w-full p-4 mb-4 h-auto'
        />
        <Input
          name='password'
          placeholder={'Password'}
          type='password'
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          required
          className='w-full p-4 mb-4 h-auto'
        />
        <Button className='w-full  h-auto p-4 mb-4 border border-none bg-[#1f2937] hover:bg-[#1f2937cc] text-white/8'>
          {isRegister ? 'Register' : 'Login'}
        </Button>
        <p className='flex justify-center items-center'>
          {isRegister ? 'Already registered?' : "Don't have an account?"}
          <a
            href={isRegister ? '/login' : '/register'}
            className='pl-3 transition-all duration-200 cursor-pointer  hover:text-white/70'
          >
            {' '}
            {isRegister ? 'Login here' : 'Register here'}
          </a>
        </p>
      </div>
    </form>
  );
}
