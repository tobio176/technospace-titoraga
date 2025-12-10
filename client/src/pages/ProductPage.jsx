import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Badge, Tabs, Tab, Image, Form, Alert, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]); // Список відгуків
    const [specs, setSpecs] = useState({});

    // Стани форми
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const [questionText, setQuestionText] = useState('');
    const [msg, setMsg] = useState(null); // Повідомлення про успіх/помилку

    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        // 1. Завантаження товару
        axios.get('https://technospace-titoraga.onrender.com/api/products')
            .then(res => {
                const found = res.data.find(p => p.id === parseInt(id));
                setProduct(found);
                if (found && found.specifications) {
                    try { setSpecs(JSON.parse(found.specifications)); } catch(e) {}
                }
            });

        // 2. Завантаження СХВАЛЕНИХ відгуків
        axios.get(`https://technospace-titoraga.onrender.com/api/reviews/product/${id}`)
            .then(res => setReviews(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const handleSubmit = async (e, type) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Будь ласка, увійдіть у систему.");
            return;
        }

        const payload = {
            productId: id,
            text: type === 'REVIEW' ? reviewText : questionText,
            rating: type === 'REVIEW' ? parseInt(rating) : 0,
            type: type
        };

        try {
            await axios.post('https://technospace-titoraga.onrender.com/api/reviews', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMsg({ type: 'success', text: 'Дякуємо! Ваше повідомлення відправлено на модерацію.' });
            setReviewText('');
            setQuestionText('');
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setMsg({ type: 'danger', text: 'Помилка: Ваш акаунт заблоковано.' });
            } else {
                setMsg({ type: 'danger', text: 'Помилка відправки.' });
            }
        }
    };

    if (!product) return <Container className="mt-5">Завантаження...</Container>;

    // Фільтруємо на клієнті для відображення у відповідних вкладках
    const productReviews = reviews.filter(r => r.type === 'REVIEW');
    const productQuestions = reviews.filter(r => r.type === 'QUESTION');

    return (
        <Container className="mt-5 mb-5">
            <Row>
                <Col md={5}>
                    <Image src={product.imageUrl || "https://via.placeholder.com/500"} fluid className="border rounded" />
                </Col>
                <Col md={7}>
                    <h1>{product.name}</h1>
                    <Badge bg="info" className="mb-3">{product.category.name}</Badge>
                    <h2 className="text-danger my-3">{product.price} ₴</h2>
                    <Button variant="success" size="lg" onClick={() => addToCart(product)}>Купити</Button>
                    <p className="text-muted mt-3">{product.description}</p>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col>
                    {msg && <Alert variant={msg.type} onClose={() => setMsg(null)} dismissible>{msg.text}</Alert>}

                    <Tabs defaultActiveKey="specs" className="mb-3">
                        <Tab eventKey="about" title="Опис">
                            <div className="p-3"><p style={{ whiteSpace: 'pre-line' }}>{product.description}</p></div>
                        </Tab>
                        <Tab eventKey="specs" title="Характеристики">
                            <div className="p-3">
                                <table className="table table-bordered table-striped">
                                    <tbody>
                                    {Object.entries(specs).map(([key, value]) => (
                                        <tr key={key}>
                                            <td className="fw-bold text-capitalize">{key}</td><td>{value}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </Tab>

                        {/* ВІДГУКИ */}
                        <Tab eventKey="reviews" title={`Відгуки (${productReviews.length})`}>
                            <div className="p-3">
                                {/* --- ПОЧАТОК СПИСКУ ВІДГУКІВ --- */}
                                {productReviews.map(r => (
                                    <div key={r.id} className="mb-4 p-3 border rounded shadow-sm bg-white">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <div>
                                                <h6 className="fw-bold mb-0">{r.user.firstname} {r.user.lastname}</h6>
                                                <small className="text-muted">{new Date(r.createdAt).toLocaleDateString()}</small>
                                            </div>
                                            {r.rating > 0 && <div className="text-warning">{'⭐'.repeat(r.rating)}</div>}
                                        </div>

                                        <p className="mb-2 text-dark">{r.text}</p>

                                        {/* --- ВІДОБРАЖЕННЯ ВІДПОВІДІ АДМІНА --- */}
                                        {r.adminReply && (
                                            <div className="mt-3 p-3 rounded" style={{ backgroundColor: '#f8f9fa', borderLeft: '4px solid #0d6efd' }}>
                                                <div className="d-flex align-items-center mb-1 text-primary fw-bold small">
                                                    <span className="me-2">🛠️</span> TechnoSpace Support
                                                </div>
                                                <p className="mb-0 small text-secondary">
                                                    {r.adminReply}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {/* --- КІНЕЦЬ СПИСКУ ВІДГУКІВ --- */}

                                <hr className="my-4"/>

                                <h5 className="mb-3">Залишити відгук</h5>
                                <Form onSubmit={(e) => handleSubmit(e, 'REVIEW')}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Оцінка</Form.Label>
                                        <Form.Select value={rating} onChange={e => setRating(e.target.value)}>
                                            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                                            <option value="4">⭐⭐⭐⭐ (4)</option>
                                            <option value="3">⭐⭐⭐ (3)</option>
                                            <option value="2">⭐⭐ (2)</option>
                                            <option value="1">⭐ (1)</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Поділіться своїми враженнями про товар..."
                                            value={reviewText}
                                            onChange={e => setReviewText(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="w-100">Надіслати відгук</Button>
                                </Form>
                            </div>
                        </Tab>

                        {/* ПИТАННЯ */}
                        <Tab eventKey="qa" title={`Питання (${productQuestions.length})`}>
                            <div className="p-3">
                                {productQuestions.map(r => (
                                    <div key={r.id} className="mb-3 border-bottom pb-3">
                                        <div className="d-flex justify-content-between">
                                            <strong>{r.user.firstname}</strong>
                                            <small className="text-muted">{new Date(r.createdAt).toLocaleDateString()}</small>
                                        </div>

                                        <p className="mb-2">{r.text}</p>

                                        {/* --- ВСТАВЛЕНО ТУТ: Блок відповіді адміна --- */}
                                        {r.adminReply && (
                                            <div className="mt-2 p-3 rounded" style={{ backgroundColor: '#f8f9fa', borderLeft: '4px solid #0dcaf0' }}>
                                                <div className="d-flex align-items-center mb-1 text-info fw-bold small">
                                                    <span className="me-2">🛠️</span> TechnoSpace Support
                                                </div>
                                                <p className="mb-0 small text-secondary">
                                                    {r.adminReply}
                                                </p>
                                            </div>
                                        )}
                                        {/* ------------------------------------------- */}
                                    </div>
                                ))}

                                <hr/>
                                <h5>Задати питання</h5>
                                <Form onSubmit={(e) => handleSubmit(e, 'QUESTION')}>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Ваше питання..."
                                            value={questionText}
                                            onChange={e => setQuestionText(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="info" type="submit" className="text-white fw-bold">Надіслати</Button>
                                </Form>
                            </div>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    );
}