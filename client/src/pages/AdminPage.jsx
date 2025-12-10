import { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';

export default function AdminPage() {
    const [formData, setFormData] = useState({
        name: '', price: '', description: '',
        categoryId: '1', // 1 - CPU (за замовчуванням)
        specifications: '{"socket": "LGA1700"}' // Приклад JSON
    });
    const [msg, setMsg] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('https://technospace-titoraga.onrender.com/api/products', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMsg({ type: 'success', text: 'Товар успішно додано!' });
        } catch (err) {
            setMsg({ type: 'danger', text: 'Помилка додавання товару' });
        }
    };

    return (
        <Container className="mt-5">
            <h2>Адмін-панель: Додати товар</h2>
            {msg && <Alert variant={msg.type}>{msg.text}</Alert>}

            <Form onSubmit={handleSubmit} className="mt-4">
                <Form.Group className="mb-3">
                    <Form.Label>Назва товару</Form.Label>
                    <Form.Control name="name" onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Ціна</Form.Label>
                    <Form.Control type="number" name="price" onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Опис</Form.Label>
                    <Form.Control as="textarea" name="description" onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Категорія (ID)</Form.Label>
                    <Form.Select name="categoryId" onChange={handleChange}>
                        <option value="1">1 - Процесори (CPU)</option>
                        <option value="2">2 - Материнські плати</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Характеристики (JSON)</Form.Label>
                    <Form.Control as="textarea" rows={3} name="specifications"
                                  defaultValue={'{"socket": "LGA1700"}'} onChange={handleChange} />
                    <Form.Text className="text-muted">
                        Наприклад: &#123;"socket": "AM4", "cores": 6&#125;
                    </Form.Text>
                </Form.Group>

                <Button variant="dark" type="submit">Додати в БД</Button>
            </Form>
        </Container>
    );
}