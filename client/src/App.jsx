import { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Badge, NavDropdown } from 'react-bootstrap';
import { jwtDecode } from "jwt-decode";
import { CartContext } from './context/CartContext';

// Імпорти сторінок
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ConfiguratorPage from './ConfiguratorPage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import ProductPage from './pages/ProductPage';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';

// Компоненти
import Footer from './components/Footer';
import LiveSearch from './components/LiveSearch';

function App() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const { cartItems } = useContext(CartContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded.sub);
                setRole(decoded.role);
            } catch (e) {
                localStorage.removeItem('token');
            }
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setRole(null);
        window.location.href = '/';
    };

    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 sticky-top py-2">
                    <Container>
                        <Navbar.Brand as={Link} to="/" className="me-4">TechnoSpace 🚀</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">

                            {/* ЛІВЕ МЕНЮ */}
                            <Nav className="me-3">
                                <NavDropdown title="Каталог" id="basic-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/catalog">📂 Всі товари</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Header>Комплектуючі</NavDropdown.Header>
                                    <NavDropdown.Item as={Link} to="/catalog/Процесори">Процесори</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/catalog/Відеокарти">Відеокарти</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/catalog/Материнські плати">Материнські плати</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/catalog/ОЗУ">ОЗУ</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/catalog/SSD накопичувачі">SSD</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/catalog/Блоки живлення">Блоки живлення</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/catalog/Корпуси">Корпуси</NavDropdown.Item>
                                    <NavDropdown.Header>Периферія</NavDropdown.Header>
                                    <NavDropdown.Item as={Link} to="/catalog/Монітори">Монітори</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/catalog/Клавіатури">Клавіатури</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/catalog/Мишки">Мишки</NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Link as={Link} to="/configurator">Конфігуратор</Nav.Link>
                            </Nav>

                            {/* ЦЕНТР: ЖИВИЙ ПОШУК */}
                            <div className="flex-grow-1 d-flex justify-content-center mx-3">
                                <LiveSearch />  {/* <--- 2. ВСТАВ ЦЕ СЮДИ */}
                            </div>

                            {/* ПРАВЕ МЕНЮ */}
                            <Nav className="ms-auto align-items-center">
                                <Nav.Link as={Link} to="/cart" className="me-3 position-relative">
                                    🛒
                                    {cartItems.length > 0 && (
                                        <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                                            {cartItems.length}
                                        </Badge>
                                    )}
                                </Nav.Link>

                                {user ? (
                                    <>
                                        {role === 'ADMIN' && (
                                            <Nav.Link as={Link} to="/admin" className="text-warning fw-bold small me-2">
                                                АДМІНКА
                                            </Nav.Link>
                                        )}
                                        <Navbar.Text className="me-3 small">
                                            <Link to="/profile" className="text-decoration-none text-info fw-bold">👤 {user}</Link>
                                        </Navbar.Text>
                                        <Button variant="outline-light" size="sm" onClick={logout}>Вихід</Button>
                                    </>
                                ) : (
                                    <>
                                        <Nav.Link as={Link} to="/login">Вхід</Nav.Link>
                                        <Nav.Link as={Link} to="/register">Реєстрація</Nav.Link>
                                    </>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <div className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/configurator" element={<ConfiguratorPage />} />
                        <Route path="/catalog" element={<CatalogPage />} />
                        <Route path="/catalog/:categoryName" element={<CatalogPage />} />
                        <Route path="/product/:id" element={<ProductPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/admin" element={role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} />
                    </Routes>
                </div>

                <Footer />
            </div>
        </Router>
    );
}

export default App;