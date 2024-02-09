export type SessionUser = {
  id: string;
  email: string;
};

export type Todos = TodoItem[];

export type TodoItem = {
  todo: string;
  completed: boolean;
  _id?: string;
};
