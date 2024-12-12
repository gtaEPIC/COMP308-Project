import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import VitalSignsForm from './components/VitalSignsForm';
import PatientInfo from './components/PatientInfo';

function App() {
  return (
    <div style={{
        minHeight: '100vh',
        minWidth: '100vw',
        alignItems: 'center',
        textAlign: 'center',
    }}>
        <Router>
            <Navbar bg={"dark"} variant={"dark"} expand={"lg"} style={{
                marginBottom: '20px',
            }}>
                <Container>
                    <Navbar.Brand href={"/"}>Vital Report</Navbar.Brand>
                    <Navbar.Toggle aria-controls={"basic-navbar-nav"} />
                    <Navbar.Collapse id={"basic-navbar-nav"}>
                        <Nav className={"me-auto"}>
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/login">Login</Nav.Link>
                            <Nav.Link href="/signup">Sign Up</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/patient/:patientId/newvital" element={<VitalSignsForm patientId={patientId} />} />
                    <Route path="/patient/:patientId" element={<PatientInfo />} />
                </Routes>
            </div>
        </Router>
    </div>
  );
}

export default App;
