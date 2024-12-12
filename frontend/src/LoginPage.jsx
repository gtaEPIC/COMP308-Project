import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import {gql, useMutation} from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    Login(username: $username, password: $password) {
      token
    }
  }
`;

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [login] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await login({ variables: { username, password } });
      if (response.errors) {
        setError("Invalid username or password.");
        return;
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password.");
    }
  };

  return (
    <Container>
      <h1>Login</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
