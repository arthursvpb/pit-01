import React, { useState, useContext } from 'react';
import {
  Row, Form, Col, Button,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from '../../utils/api';
import { TodoContext } from '../../pages/Todo/TodoContextProvider';

export default function TodoForm() {
  const [todos, setTodos] = useContext(TodoContext);
  const [todo, setTodo] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!todo.trim()) {
      return alert('Todo vazio');
    }

    try {
      const response = await axios.post('/todo', { completed: false, name: todo });

      setTodos([
        ...todos,
        response.data.data,
      ]);

      setTodo('');

      toast.info('Task created with success');
    } catch (error) {
      console.log(error.message);
    }
  };

  const onChange = ({ target: { value } }) => {
    setTodo(value);
  };

  return (
    <Form className="mb-3" onSubmit={handleSubmit}>
      <Row>
        <Col lg={9} xl={9}>
          <Form.Group>
            <Form.Control
              value={todo}
              onChange={onChange}
              placeholder="Insert your daily activity"
            />
          </Form.Group>
        </Col>
        <Col>
          <Button disabled={!todo.trim()} type="submit">Add Todo</Button>
        </Col>
      </Row>
    </Form>
  );
}
