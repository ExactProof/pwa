import { openDB } from 'idb';

const DB_NAME = 'todo-db';
const STORE_NAME = 'todos';

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    },
  });
};

export const addTodo = async (todo: string) => {
  const db = await initDB();
  await db.add(STORE_NAME, { text: todo });
};

export const getTodos = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const updateTodo = async (id: number, text: string) => {
  const db = await initDB();
  await db.put(STORE_NAME, { id, text });
};

export const deleteTodo = async (id: number) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};
