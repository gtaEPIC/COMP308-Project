import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button, Row, Col, Alert } from "react-bootstrap";

const LandingPage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch logged-in user info using GraphQL
    const fetchUser = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4000/graphql",
          {
            query: `
              query GetMe {
                GetMe {
                  id
                  username
                  type
                }
              }
            `,
          },
          {
            headers: {
              Authorization: `Bearer ${document.cookie.split("=")[1]}`, // Fetch token from cookies
            },
          }
        );

        setUser(response.data.data.GetMe);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Please log in to access the dashboard.");
      }
    };

    fetchUser();
  }, []);

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/signup");

  if (error) {
    return (
      <Container className="text-center">
        <h1>Welcome to Vital Report</h1>
        <p>{error}</p>
        <Button variant="primary" onClick={handleLogin} className="m-2">
          Login
        </Button>
        <Button variant="secondary" onClick={handleRegister} className="m-2">
          Register
        </Button>
      </Container>
    );
  }

  if (user) {
    if (user.type === "nurse") {
      return (
        <Container>
          <h1>Welcome, Nurse {user.username}!</h1>
          <Alert variant="info">You have new alerts!</Alert>
          <h2>Registered Patients</h2>
          <Row>
            {/* Replace with dynamically fetched patient data */}
            <Col>
              <Button variant="link" href="/patient/123">
                Patient 1
              </Button>
            </Col>
            <Col>
              <Button variant="link" href="/patient/456">
                Patient 2
              </Button>
            </Col>
          </Row>
        </Container>
      );
    } else if (user.type === "patient") {
      return (
        <Container>
          <h1>Welcome, {user.username}!</h1>
          <Row className="mb-3">
            <Col>
              <Button variant="primary" href={`/patient/${user.id}/newvital`}>
                Enter Vital Signs
              </Button>
            </Col>
            <Col>
              <Button variant="warning" disabled>
                Send Emergency Alert
              </Button>
            </Col>
            <Col>
              <Button variant="success" href={`/patient/${user.id}`}>
                View My Page
              </Button>
            </Col>
          </Row>
        </Container>
      );
    }
  }

  return (
    <Container className="text-center">
      <h1>Welcome to Vital Report</h1>
      <p>Please log in or register to continue.</p>
      <Button variant="primary" onClick={handleLogin} className="m-2">
        Login
      </Button>
      <Button variant="secondary" onClick={handleRegister} className="m-2">
        Register
      </Button>
    </Container>
  );
};

export default LandingPage;
