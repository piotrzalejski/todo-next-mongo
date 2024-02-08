'use client';

import Nav from '@/components/nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'authenticated') {
      router.push('/login');
    }
  }, []);

  if (status === 'authenticated') {
    console.log('useSession object: ', session);
    return (
      <main className='text-5xl grid place-items-center w-full'>
        {/* stylize Nav better */}
        <Nav />
        <div className='flex gap-2 mt-[5rem]'>
          <Input placeholder='Type Todo' />
          <Button>Add todo</Button>
        </div>
      </main>
    );
  } else {
    return null;
  }
}
