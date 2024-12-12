import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import {gql, useMutation} from "@apollo/client";

const SIGNUP_MUTATION = gql`
  mutation AddUser($username: String!, $password: String!, $type: String!) {
    AddUser(username: $username, password: $password, type: $type)
  }
`;

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("patient");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [signup] = useMutation(SIGNUP_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await signup({ variables: { username, password, type: userType } });
      if (response.errors) {
          setError("Registration failed. Please try again. " + response.errors[0].message);
          return;
      }
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again. " + err.message);
    }
  };

  return (
    <Container>
      <h1>Register</h1>
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
        <Form.Group controlId="userType" className="mt-3">
          <Form.Label>Register As:</Form.Label>
          <Form.Select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="patient">Patient</option>
            <option value="nurse">Nurse</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default SignUpPage;
