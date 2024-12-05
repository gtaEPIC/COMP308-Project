import './App.css'
import {Container, Nav, Navbar} from "react-bootstrap";
import {Link, BrowserRouter as Router, Routes, Route} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

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
                            {/* NAVIGATION BAR */}
                            <Nav.Link as={Link} to={"/"}>
                                Home
                            </Nav.Link>

                            <Nav.Link as={Link} to={"/login"}>
                                Login
                            </Nav.Link>

                            <Nav.Link as={Link} to={"/signup"}>
                                Sign Up
                            </Nav.Link>

                            {/* END OF NAVIGATION BAR */}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div>
                <Routes>
                    {/* ADD ROUTES HERE */}
                    <Route index element={<Home />} />
                </Routes>
            </div>
        </Router>
    </div>
  )
}

export default App
