import React, { useState, useContext } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from '../../utils/api';
import { TodoContext } from '../../pages/Todo/TodoContextProvider';

import Modal from '../Modal';

import './Todo.scss';

const TodoList = () => {
  const [todos, setTodos] = useContext(TodoContext);
  const [editTodo, setEditTodo] = useState();
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState('');

  const handleChecked = async (event, _editTodo) => {
    const { checked: completed } = event.target;

    const newTodos = todos.map((todo) => {
      if (todo.id === _editTodo.id) {
        return {
          ...todo,
          completed,
        };
      }

      return todo;
    });

    try {
      await axios.put(`todos/${_editTodo.id}`, { ..._editTodo, completed });
      setTodos(newTodos);
      toast.info('Task updated with success');
    } catch (e) {
      console.error(e.message);
    }
  };

  const handleEdit = (todo) => {
    setEditTodo(todo);
    setText(todo?.name);
    setShowModal(!showModal);
  };

  const handleRemove = async ({ _id }) => {
    const newTodos = todos.filter((todo) => todo._id !== _id);

    try {
      await axios.delete(`/todo/${_id}`);
      setTodos(newTodos);
      toast.info('Task deleted with success');
    } catch (e) {
      console.error(e);
    }
  };

  const onEditTodo = async () => {
    const name = text;
    const newTodos = todos.map((todo) => {
      if (todo._id === editTodo._id) {
        return {
          ...todo,
          name,
        };
      }

      return todo;
    });

    try {
      await axios.put(`/todo/${editTodo._id}`, { ...editTodo, name });
      setTodos(newTodos);
      handleEdit();
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <>
      <Table bordered hover className="todos">
        <thead>
          <tr>
            <th>#</th>
            <th width="60%">Task</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo, index) => (
            <tr key={index} className="todo">
              <td>
                <input
                  checked={todo.completed}
                  onChange={(event) => handleChecked(event, todo)}
                  type="checkbox"
                />
              </td>
              <td>
                <span className={todo.completed ? 'done' : ''}>{todo.name}</span>
              </td>
              <td>
                <Button
                  onClick={() => handleEdit(todo)}
                >
                  <FaPencilAlt />
                  {' Edit'}
                </Button>
                <Button
                  onClick={() => handleRemove(todo)}
                  className="ml-2"
                  variant="danger"
                >
                  <FaTrash />
                  {' Remove'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal
        onSubmit={onEditTodo}
        show={showModal}
        toggle={() => handleEdit()}
        title={editTodo?.name}
      >
        <Form.Group>
          <Form.Label>Todo Name</Form.Label>
          <Form.Control
            value={text}
            onChange={({ target: { value } }) => setText(value)}
          />
        </Form.Group>
      </Modal>
    </>
  );
};

export default TodoList;
