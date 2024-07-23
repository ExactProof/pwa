import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { addTodo, deleteTodo, getTodos, updateTodo } from './db';

interface Todo {
  id: number;
  text: string;
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  max-width: 600px;
  margin: auto;
  overflow-wrap: break-word;
`;

const Header = styled.header`
  font-size: 2em;
  color: #333;
  margin-bottom: 20px;
`;

const TodoInput = styled.input`
  padding: 10px;
  font-size: 1em;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  width: 150px;

  &:hover {
    background-color: #0056b3;
  }
`;

const TodoList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

const TodoItem = styled.li`
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TodoText = styled.span`
  width: calc(100% - 120px);;
  flex-grow: 1;
  margin-right: 10px;
`;

const EditButton = styled.button`
  margin-right: 5px;
  padding: 5px 10px;
  font-size: 0.8em;
  border: none;
  border-radius: 5px;
  background-color: #ffc107;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #e0a800;
  }
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  font-size: 0.8em;
  border: none;
  border-radius: 5px;
  background-color: #dc3545;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      const todosFromDB = await getTodos();
      setTodos(todosFromDB);
    };
    fetchTodos();

    if (typeof window !== "undefined") {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'ja-JP';
      recognition.onresult = (event) => {
        setNewTodo(event.results[0][0].transcript);
      };
      setRecognition(recognition);
    }
  }, []);

  const startVoiceInput = () => {
    recognition?.start();
  };

  const addNewTodo = async () => {
    if (newTodo.trim()) {
      await addTodo(newTodo);
      const todosFromDB = await getTodos();
      setTodos(todosFromDB);
      setNewTodo('');
    }
  };

  const editTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.text);
  };

  const updateExistingTodo = async () => {
    if (editingTodo && newTodo.trim()) {
      await updateTodo(editingTodo.id, newTodo);
      const todosFromDB = await getTodos();
      setTodos(todosFromDB);
      setNewTodo('');
      setEditingTodo(null);
    }
  };

  const deleteExistingTodo = async (id: number) => {
    await deleteTodo(id);
    const todosFromDB = await getTodos();
    setTodos(todosFromDB);
  };

  return (
    <AppContainer>
      <Header>TODO App</Header>
      <TodoInput
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <AddButton onClick={editingTodo ? updateExistingTodo : addNewTodo}>
        {editingTodo ? 'Update TODO' : 'Add TODO'}
      </AddButton>
      <button onClick={startVoiceInput}>🎤</button>
      <TodoList>
          {todos.map((todo) => (
            <TodoItem key={todo.id}>
              <TodoText>{todo.text}</TodoText>
              <EditButton onClick={() => editTodo(todo)}>Edit</EditButton>
              <DeleteButton onClick={() => deleteExistingTodo(todo.id)}>Delete</DeleteButton>
            </TodoItem>
          ))}
      </TodoList>
    </AppContainer>
  );
};

export default App;
