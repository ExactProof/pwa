import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { addTodo, deleteTodo, getTodos, updateTodo } from './db';

jest.mock('./db');

const mockedAddTodo = addTodo as jest.MockedFunction<typeof addTodo>;
const mockedGetTodos = getTodos as jest.MockedFunction<typeof getTodos>;
const mockedUpdateTodo = updateTodo as jest.MockedFunction<typeof updateTodo>;
const mockedDeleteTodo = deleteTodo as jest.MockedFunction<typeof deleteTodo>;

beforeEach(() => {
  mockedGetTodos.mockResolvedValue([]);
});

test('renders TODO app', async () => {
  render(<App />);
  await waitFor(() => {
    const linkElement = screen.getByText(/TODO App/i);
    expect(linkElement).toBeInTheDocument();
  });
});

test('adds a TODO', async () => {
  render(<App />);
  const inputElement = screen.getByRole('textbox');
  const addButton = screen.getByText(/Add TODO/i);

  fireEvent.change(inputElement, { target: { value: 'New TODO' } });
  fireEvent.click(addButton);

  mockedGetTodos.mockResolvedValue([{ id: 1, text: 'New TODO' }]);

  await waitFor(() => {
    const todoItem = screen.getByText('New TODO');
    expect(todoItem).toBeInTheDocument();
  });
});

test('edits a TODO', async () => {
  mockedGetTodos.mockResolvedValue([{ id: 1, text: 'Existing TODO' }]);

  render(<App />);
  const editButton = await screen.findByText(/Edit/i);

  fireEvent.click(editButton);
  const inputElement = screen.getByRole('textbox');
  fireEvent.change(inputElement, { target: { value: 'Updated TODO' } });
  const updateButton = screen.getByText(/Update TODO/i);
  fireEvent.click(updateButton);

  mockedGetTodos.mockResolvedValue([{ id: 1, text: 'Updated TODO' }]);

  await waitFor(() => {
    const todoItem = screen.getByText('Updated TODO');
    expect(todoItem).toBeInTheDocument();
  });
});

test('deletes a TODO', async () => {
  mockedGetTodos.mockResolvedValue([{ id: 1, text: 'Existing TODO' }]);

  render(<App />);
  const deleteButton = await screen.findByText(/Delete/i);

  fireEvent.click(deleteButton);

  mockedGetTodos.mockResolvedValue([]);

  await waitFor(() => {
    const todoItem = screen.queryByText('Existing TODO');
    expect(todoItem).not.toBeInTheDocument();
  });
});
