import { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstname: '', lastname: '', email: '', password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Відправляння даних на Java-бекенд
            const response = await axios.post('https://technospace-titoraga.onrender.com/api/auth/register', formData);

            // Якщо успішно - збереження токена
            localStorage.setItem('token', response.data.token);
            alert("Реєстрація успішна!");
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError("Помилка реєстрації. Можливо, такий email вже існує.");
        }
    };

    return (
        <Container className="d-flex justify-content-center mt-5">
            <Card style={{ width: '400px' }} className="shadow">
                <Card.Body>
                    <h2 className="text-center mb-4">Реєстрація</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Ім'я</Form.Label>
                            <Form.Control name="firstname" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Прізвище</Form.Label>
                            <Form.Control name="lastname" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control type="password" name="password" onChange={handleChange} required />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">Зареєструватися</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}