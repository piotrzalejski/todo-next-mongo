import Link from 'next/link';
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';

export default function Nav() {
  return (
    <nav>
      <Button variant='ghost' className='text-slate-500 hover:text-slate-700'>
        <Link href='/login' onClick={() => signOut({ callbackUrl: '/login' })}>
          Logout
        </Link>
      </Button>
    </nav>
  );
}
