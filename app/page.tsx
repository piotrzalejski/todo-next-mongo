'use client';

import Nav from '@/components/nav';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { SessionUser, TodoItem, Todos } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const fetchTodos = async (userId: string) => {
  try {
    const res = await fetch(`/api/todos?userId=${userId}`);
    const data = await res.json();
    if (data.todos) {
      const extractedTodos = data.todos.flatMap(
        (todoObject: { _id: string; todos: Todos[] }) => todoObject.todos
      );
      return extractedTodos;
    } else {
      console.error('No todos found:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
};

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [todos, setTodos] = useState<Todos>([]);
  const [todo, setTodo] = useState('');
  const [isloading, setIsLoading] = useState(true);
  const [editTodo, setEditTodo] = useState<string>('');
  const [editTodoId, setEditTodoId] = useState<string>('');
  let userId = '';

  if (session?.user) {
    userId = (session.user as SessionUser).id;
  }

  const handleAddTodo = async () => {
    if (!todo) return;
    if (status === 'authenticated' && session?.user) {
      const res = await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ userId: userId, todo: todo }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 201) {
        setTodo('');
        fetchTodos(userId)
          .then((extractedTodos) => {
            setTodos(extractedTodos);
          })
          .catch((error) => {
            console.error('Error fetching todos:', error);
          });
      }
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (status === 'authenticated' && session?.user) {
      const res = await fetch('/api/todos', {
        method: 'DELETE',
        body: JSON.stringify({ userId: userId, id: id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 200) {
        const newTodos = todos.filter((todo) => todo._id !== id);
        setTodos(newTodos);
      } else {
        console.error('Client: Error deleting todo');
      }
    }
  };

  const handleEditTodo = (todo: string, id: string) => {
    setEditTodoId(id);
    setEditTodo(todo);
  };

  const handleEditSave = async () => {
    if (status === 'authenticated' && session?.user) {
      try {
        const res = await fetch(`/api/todos/${editTodoId}`, {
          method: 'PUT',
          body: JSON.stringify({
            userId: userId,
            todo: editTodo,
            completed: false,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.status === 202) {
          setEditTodo('');
          setEditTodoId('');
          fetchTodos(userId)
            .then((extractedTodos) => {
              setTodos(extractedTodos);
            })
            .catch((error) => {
              console.error('Error fetching todos:', error);
            });
        }
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    }
  };

  const toggleTodo = async (todoItem: TodoItem) => {
    if (status === 'authenticated' && session?.user) {
      try {
        const res = await fetch(`/api/todos/${todoItem._id}`, {
          method: 'PUT',
          body: JSON.stringify({
            userId: userId,
            todo: todoItem.todo,
            completed: !todoItem.completed,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.status === 202) {
          fetchTodos(userId)
            .then((extractedTodos) => {
              setTodos(extractedTodos);
            })
            .catch((error) => {
              console.error('Error fetching todos:', error);
            });
        }
      } catch (error) {
        console.error('Error updating todo:', error);
      }
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
      fetchTodos(userId)
        .then((extractedTodos) => {
          setTodos(extractedTodos);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching todos:', error);
        });
    }
    // fetch todos when component mounts or when status or session changes
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
        <div className='flex flex-col sticky top-0 z-50 bg-background w-full justify-center items-center pb-6'>
          <Nav />

          <h2 className='text-slate-500 mt-8 '>Todo List:</h2>

          {editTodo ? (
            <div className='w-8/12 sm:w-full flex flex-col sm:flex-row gap-2 mt-[5rem] justify-center max-w-[450px] items-center'>
              <Input
                placeholder='Type Todo'
                type='text'
                className='max-w-[350px]'
                value={editTodo}
                onChange={(e) => setEditTodo(e.target.value)}
              />
              <Button
                className='mt-2 sm:mt-0  bg-slate-600 hover:bg-slate-700'
                onClick={() => handleEditSave()}
              >
                Save
              </Button>
            </div>
          ) : (
            <div className='w-8/12 sm:w-full flex flex-col sm:flex-row gap-2 mt-[5rem] justify-center max-w-[450px] items-center'>
              <Input
                placeholder='Type Todo'
                type='text'
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
              />
              <Button
                className='mt-2 sm:mt-0 bg-slate-600 hover:bg-slate-700'
                onClick={handleAddTodo}
              >
                Add
              </Button>
            </div>
          )}
        </div>
        {/* Todo List */}
        <div className='overflow-y-auto overflow-x-hidden w-full mx-4'>
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
                      className='flex flex-col sm:flex-row sm:justify-between items-center my-4 px-4 py-2 bg-[#27272a] rounded-md text-[#a1a1aa] text-lg shadow-md sm:w-96 w-full transition-all duration-300 max-w-[350px] sm:max-w-[430px] border'
                    >
                      <div className='flex items-center w-full sm:w-auto'>
                        <Checkbox
                          id={todoItem._id}
                          checked={todoItem.completed}
                          onClick={() => toggleTodo(todoItem)}
                        />
                        <label
                          className={`${
                            todoItem.completed
                              ? 'line-through text-yellow-700'
                              : 'list-none'
                          } px-4 `}
                          htmlFor={todoItem._id}
                        >
                          {todoItem.todo}
                        </label>
                      </div>
                      <div className='flex justify-center sm:justify-between mt-2 sm:mt-0'>
                        <Button
                          variant='ghost'
                          className='text-sky-400 hover:text-sky-600 uppercase transition-all duration-200'
                          onClick={() =>
                            handleEditTodo(
                              todoItem.todo,
                              todoItem._id as string
                            )
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant='ghost'
                          className='text-red-400 hover:text-red-600 uppercase transition-all duration-200'
                          onClick={() =>
                            handleDeleteTodo(todoItem._id as string)
                          }
                        >
                          Del
                        </Button>
                      </div>
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
