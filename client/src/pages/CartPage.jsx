import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
    const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        deliveryAddress: '',
        paymentMethod: 'CASH'
    });

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            alert("Увійдіть у систему!");
            navigate('/login');
            return;
        }

        const orderData = {
            items: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity
            })),
            ...formData
        };

        try {
            await axios.post('http://localhost:8080/api/orders', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("✅ Замовлення успішно оформлено! Менеджер зв'яжеться з вами.");
            clearCart();
            setShowModal(false);
            navigate('/profile');
        } catch (error) {
            console.error(error);
            alert("Помилка при оформленні 😢");
        }
    };

    if (cartItems.length === 0) {
        return <Container className="mt-5 text-center"><h3>Кошик порожній 🛒</h3></Container>;
    }

    return (
        <Container className="mt-5">
            <h2>Ваш Кошик</h2>
            <Table striped bordered hover className="mt-3">
                <thead>
                <tr><th>Товар</th><th>Ціна</th><th>Кількість</th><th>Сума</th><th>Дія</th></tr>
                </thead>
                <tbody>
                {cartItems.map(item => (
                    <tr key={item.id}>
                        <td>{item.name}</td><td>{item.price} ₴</td><td>{item.quantity}</td>
                        <td>{item.price * item.quantity} ₴</td>
                        <td><Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>X</Button></td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-end align-items-center gap-3">
                <h3>Всього: {total} ₴</h3>
                <Button variant="success" size="lg" onClick={() => setShowModal(true)}>Оформити замовлення</Button>
            </div>

            {/* МОДАЛЬНЕ ВІКНО ОФОРМЛЕННЯ */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><Modal.Title>Оформлення доставки 📦</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCheckout}>
                        <Form.Group className="mb-3">
                            <Form.Label>ПІБ отримувача</Form.Label>
                            <Form.Control name="fullName" required onChange={handleInputChange} placeholder="Іванов Іван Іванович" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Номер телефону</Form.Label>
                            <Form.Control name="phoneNumber" required onChange={handleInputChange} placeholder="+380..." />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Адреса доставки (Нова Пошта)</Form.Label>
                            <Form.Control name="deliveryAddress" required onChange={handleInputChange} placeholder="м. Київ, відділення №1" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Спосіб оплати (при отриманні)</Form.Label>
                            <Form.Select name="paymentMethod" onChange={handleInputChange}>
                                <option value="CASH">💵 Готівка</option>
                                <option value="CARD">💳 Карткою</option>
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">Підтвердити замовлення</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}