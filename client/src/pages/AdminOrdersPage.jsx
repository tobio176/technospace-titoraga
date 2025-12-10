import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Form, Badge, Card, Spinner } from 'react-bootstrap';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Функція завантаження
    const fetchOrders = () => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:8080/api/orders/all', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Зміна статусу
    const handleStatusChange = (orderId, newStatus) => {
        const token = localStorage.getItem('token');
        axios.put(`http://localhost:8080/api/orders/${orderId}/status?status=${newStatus}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert("Статус оновлено!");
                fetchOrders();
            })
            .catch(err => alert("Помилка оновлення"));
    };

    // Колір для бейджів статусу
    const getStatusBadge = (status) => {
        switch(status) {
            case 'NEW': return 'primary';
            case 'IN_PROGRESS': return 'warning';
            case 'COMPLETED': return 'success';
            case 'CANCELLED': return 'danger';
            default: return 'secondary';
        }
    };

    if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;

    return (
        <Container className="mt-4">
            <h2>🛠️ Керування замовленнями</h2>
            <Table striped bordered hover responsive className="mt-3">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Клієнт / Доставка</th>
                    <th>Товари</th>
                    <th>Сума / Оплата</th>
                    <th>Статус</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>
                            <strong>{order.fullName}</strong><br/>
                            <small>{order.phoneNumber}</small><br/>
                            <small className="text-muted">{order.deliveryAddress}</small>
                        </td>
                        <td>
                            <ul className="list-unstyled mb-0">
                                {order.items.map(item => (
                                    <li key={item.id}><small>{item.product.name} (x{item.quantity})</small></li>
                                ))}
                            </ul>
                        </td>
                        <td>
                            <strong>{order.totalPrice} ₴</strong><br/>
                            <Badge bg="secondary">{order.paymentMethod === 'CASH' ? 'Готівка' : 'Картка'}</Badge>
                        </td>
                        <td style={{width: '200px'}}>
                            <Form.Select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className={`border-${getStatusBadge(order.status)}`}
                            >
                                <option value="Нове замовлення">Нове</option>
                                <option value="IN_PROGRESS">В обробці</option>
                                <option value="COMPLETED">Виконано ✅</option>
                                <option value="CANCELLED">Скасовано ❌</option>
                            </Form.Select>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}