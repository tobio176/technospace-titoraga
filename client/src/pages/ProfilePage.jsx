import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Badge, Card, Spinner } from 'react-bootstrap';

export default function ProfilePage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('https://technospace-titoraga.onrender.com/api/orders/my', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <Container className="mt-5">
            <h2 className="mb-4">📜 Моя історія замовлень</h2>
            {orders.length === 0 ? (
                <p>Ви ще нічого не замовляли.</p>
            ) : (
                orders.map(order => (
                    <Card key={order.id} className="mb-3 shadow-sm">
                        <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                            <span><strong>Замовлення #{order.id}</strong> від {new Date(order.createdAt).toLocaleString()}</span>
                            <Badge bg="info">{order.status}</Badge>
                        </Card.Header>
                        <Card.Body>
                            <Table size="sm" borderless>
                                <thead>
                                <tr>
                                    <th>Товар</th>
                                    <th>Кількість</th>
                                    <th>Ціна</th>
                                </tr>
                                </thead>
                                <tbody>
                                {order.items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.product.name}</td>
                                        <td>{item.quantity} шт.</td>
                                        <td>{item.priceAtPurchase} ₴</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            <hr />
                            <h5 className="text-end">Сума: {order.totalPrice} ₴</h5>
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    );
}