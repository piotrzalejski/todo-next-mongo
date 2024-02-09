'use client';

import Nav from '@/components/nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SessionUser, Todos } from '@/lib/types';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [todos, setTodos] = useState<Todos>([]);
  const [todo, setTodo] = useState('');
  const [isloading, setIsLoading] = useState(true);
  let userId = '';

  if (session?.user) {
    userId = (session.user as SessionUser).id;
  }

  const addTodo = async () => {
    if (!todo) return;
    if (status === 'authenticated' && session?.user) {
      const res = await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ userId: userId, todo: todo }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      console.log('data: ', data.todos);
      const newTodo = data.todos[data.todos.length - 1];
      setTodos([...todos, newTodo]);
      setTodo('');
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (status !== 'authenticated') {
      router.push('/login');
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetch(`/api/todos?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('fetch data: ', data);
          if (data.todos) {
            const extractedTodos = data.todos.flatMap(
              (todoObject: { _id: string; todos: Todos[] }) => todoObject.todos
            );
            console.log('extracted: ', extractedTodos);
            setTodos(extractedTodos);
            setIsLoading(false);
          } else {
            console.error('No todos found:', data.message);
          }
        })
        .catch((error) => {
          console.error('Error fetching todos:', error);
        });
      console.log('useSession Object: ', session);
    }
  }, [status, session, userId]);

  if (status === 'loading') {
    return (
      <div className='h-screen flex justify-center items-center'>
        Loading...
      </div>
    );
  }
  if (status === 'authenticated') {
    return (
      <main className='text-5xl grid place-items-center w-full'>
        {/* stylize Nav better */}
        <Nav />
        <h2 className='text-white mt-8'>Todo List:</h2>
        <div className='w-full flex gap-2 mt-[5rem] justify-center'>
          <Input
            placeholder='Type Todo'
            type='text'
            className='max-w-[350px]'
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <Button onClick={addTodo}>Add todo</Button>
        </div>
        <div>
          <ul className='w-full px-4 flex flex-col justify-center items-center my-6 py-6'>
            {isloading && <p>Loading...</p>}
            {!isloading && todos && todos.length === 0 ? (
              <div className='text-2xl italic my-10'>No todos present</div>
            ) : (
              <>
                {!isloading &&
                  todos &&
                  todos.length > 0 &&
                  todos.map((todoItem) => (
                    <li
                      key={todoItem._id}
                      className='flex justify-between items-center my-4 px-4 py-2 bg-[#27272a] rounded-md text-[#a1a1aa] text-lg shadow-md sm:w-96 w-full'
                    >
                      <span>{todoItem.todo}</span>
                      {/* Add delete button here */}
                    </li>
                  ))}
              </>
            )}
          </ul>
        </div>
      </main>
    );
  } else {
    return null;
  }
}
