import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Form, Badge, Button, Tabs, Tab, Alert, Row, Col, Card, Modal, InputGroup } from 'react-bootstrap';

export default function AdminDashboard() {
    // --- СТАНИ ---
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [pendingReviews, setPendingReviews] = useState([]);
    const [replyText, setReplyText] = useState({});
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]); // Всі товари
    const [key, setKey] = useState('orders');

    // Фільтрація та Сортування товарів
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' }); // 'asc' or 'desc'

    // Стан для форми (Додавання/Редагування)
    const [productForm, setProductForm] = useState({
        id: null, // Якщо null - це додавання, якщо є ID - редагування
        name: '', price: '', description: '', imageUrl: '', categoryId: ''
    });
    const [specs, setSpecs] = useState({});
    const [showModal, setShowModal] = useState(false); // Показати/сховати модалку

    const token = localStorage.getItem('token');
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    // Шаблони характеристик
    const CATEGORY_TEMPLATES = {
        'Процесори': ['socket', 'cores', 'frequency', 'tdp'],
        'Материнські плати': ['socket', 'form_factor', 'ram_slots'],
        'Відеокарти': ['memory', 'type', 'power_req'],
        'ОЗУ': ['capacity', 'frequency', 'type'],
        'SSD накопичувачі': ['capacity', 'interface', 'read', 'write'],
        'Блоки живлення': ['watt', 'efficiency', 'modular'],
        'Корпуси': ['form_factor', 'front', 'max_gpu_length'],
        'Монітори': ['resolution', 'refresh_rate', 'panel'],
        'Клавіатури': ['type', 'switch', 'layout'],
        'Мишки': ['dpi', 'buttons', 'wireless']
    };

    // --- ЗАВАНТАЖЕННЯ ДАНИХ ---
    const fetchData = () => {
        axios.get('https://technospace-titoraga.onrender.com/api/orders/all', authHeader).then(res => setOrders(res.data)).catch(console.error);
        axios.get('https://technospace-titoraga.onrender.com/api/admin/users', authHeader).then(res => setUsers(res.data)).catch(console.error);
        axios.get('https://technospace-titoraga.onrender.com/api/admin/reviews/pending', authHeader).then(res => setPendingReviews(res.data)).catch(console.error);
        axios.get('https://technospace-titoraga.onrender.com/api/products/categories').then(res => setCategories(res.data)).catch(console.error);
        axios.get('https://technospace-titoraga.onrender.com/api/products').then(res => setProducts(res.data)).catch(console.error);
    };

    useEffect(() => { fetchData(); }, []);

    // --- ЛОГІКА ТОВАРІВ ---

    // 1. Сортування та Фільтрація
    const getProcessedProducts = () => {
        let processed = [...products];

        // Пошук
        if (searchTerm) {
            processed = processed.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        // Фільтр категорії
        if (filterCategory) {
            processed = processed.filter(p => p.category.id === parseInt(filterCategory));
        }
        // Сортування
        processed.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return processed;
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // 2. Відкриття форми (Додавання або Редагування)
    const openProductModal = (product = null) => {
        if (product) {
            // Режим редагування
            setProductForm({
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                imageUrl: product.imageUrl,
                categoryId: product.category.id
            });
            try {
                setSpecs(JSON.parse(product.specifications));
            } catch (e) {
                setSpecs({});
            }
        } else {
            // Режим додавання
            setProductForm({ id: null, name: '', price: '', description: '', imageUrl: '', categoryId: '' });
            setSpecs({});
        }
        setShowModal(true);
    };

    // 3. Збереження (Create or Update)
    const handleSaveProduct = (e) => {
        e.preventDefault();
        const payload = { ...productForm, specifications: JSON.stringify(specs) };

        if (productForm.id) {
            // UPDATE
            axios.put(`https://technospace-titoraga.onrender.com/api/products/${productForm.id}`, payload, authHeader)
                .then(() => { alert('Оновлено!'); setShowModal(false); fetchData(); })
                .catch(err => alert('Помилка: ' + err.message));
        } else {
            // CREATE
            axios.post('https://technospace-titoraga.onrender.com/api/products', payload, authHeader)
                .then(() => { alert('Створено!'); setShowModal(false); fetchData(); })
                .catch(err => alert('Помилка: ' + err.message));
        }
    };

    // 4. Видалення
    const handleDeleteProduct = (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей товар? Це незворотно.')) {
            axios.delete(`https://technospace-titoraga.onrender.com/api/products/${id}`, authHeader)
                .then(() => { fetchData(); })
                .catch(err => alert('Помилка видалення'));
        }
    };

    // Допоміжні функції
    const handleCategoryChange = (e) => {
        setProductForm({ ...productForm, categoryId: e.target.value });
        setSpecs({});
    };
    const selectedCategoryName = categories.find(c => c.id === parseInt(productForm.categoryId))?.name;

    // --- ДІЇ ДЛЯ ЗАМОВЛЕНЬ/ЮЗЕРІВ ---
    const updateOrderStatus = (id, status) => {
        axios.put(`https://technospace-titoraga.onrender.com/api/orders/${id}/status?status=${status}`, {}, authHeader).then(() => { alert('Оновлено'); fetchData(); });
    };
    const moderateReview = (id, status) => {
        axios.put(`https://technospace-titoraga.onrender.com/api/admin/reviews/${id}/status?status=${status}`, {}, authHeader).then(() => fetchData());
    };
    const toggleBan = (id) => {
        axios.put(`https://technospace-titoraga.onrender.com/api/admin/users/${id}/ban`, {}, authHeader).then(() => fetchData());
    };
    const formatPayment = (method) => method === 'CASH' ? '💵 Готівка' : '💳 Картка';

    // Функція відправки відповіді
    const handleSendReply = (reviewId) => {
        const text = replyText[reviewId];
        if (!text) return alert("Введіть текст відповіді!");

        axios.put(`https://technospace-titoraga.onrender.com/api/admin/reviews/${reviewId}/reply`, { reply: text }, authHeader)
            .then(() => {
                alert("Відповідь додано!");
                // Очистити поле
                setReplyText({ ...replyText, [reviewId]: '' });
                fetchData(); // Оновити список
            })
            .catch(err => alert("Помилка: " + err.message));
    };

    return (
        <Container className="mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>⚙️ Панель Адміністратора</h2>
                <Button variant="success" size="lg" onClick={() => openProductModal(null)}>➕ Додати товар</Button>
            </div>

            <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">

                {/* Вкл. 1: КЕРУВАННЯ ТОВАРАМИ */}
                <Tab eventKey="products" title={`📦 Товари (${products.length})`}>
                    <Card className="border-0 shadow-sm p-3 mb-3 bg-light">
                        <Row>
                            <Col md={4}>
                                <InputGroup>
                                    <InputGroup.Text>🔍</InputGroup.Text>
                                    <Form.Control
                                        placeholder="Пошук за назвою..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={4}>
                                <Form.Select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                                    <option value="">📂 Всі категорії</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </Form.Select>
                            </Col>
                        </Row>
                    </Card>

                    <Table striped hover responsive>
                        <thead className="table-dark" style={{cursor: 'pointer'}}>
                        <tr>
                            <th onClick={() => handleSort('id')}>ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '⬆' : '⬇')}</th>
                            <th>Фото</th>
                            <th onClick={() => handleSort('name')}>Назва {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '⬆' : '⬇')}</th>
                            <th>Категорія</th>
                            <th onClick={() => handleSort('price')}>Ціна {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '⬆' : '⬇')}</th>
                            <th>Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {getProcessedProducts().map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td><img src={p.imageUrl} alt="" style={{width: '40px', height: '40px', objectFit: 'contain'}} /></td>
                                <td className="fw-bold">{p.name}</td>
                                <td><Badge bg="info">{p.category.name}</Badge></td>
                                <td>{p.price} ₴</td>
                                <td>
                                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openProductModal(p)}>✏️</Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteProduct(p.id)}>🗑️</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Tab>

                {/* --- Вкл. 2: ЗАМОВЛЕННЯ --- */}
                <Tab eventKey="orders" title={`Замовлення (${orders.length})`}>
                    <Table striped bordered hover responsive>
                        <thead className="table-dark">
                        <tr><th>ID</th><th>Клієнт</th><th>Доставка</th><th>Товари</th><th>Сума</th><th>Статус</th></tr>
                        </thead>
                        <tbody>
                        {orders.map(o => (
                            <tr key={o.id}>
                                <td>#{o.id}</td>
                                <td><strong>{o.fullName}</strong><br/>{o.phoneNumber}</td>
                                <td>{o.deliveryAddress}<br/><small>{formatPayment(o.paymentMethod)}</small></td>
                                <td><ul className="list-unstyled m-0">{o.items.map(i => <li key={i.id}><small>{i.product.name} x{i.quantity}</small></li>)}</ul></td>
                                <td>{o.totalPrice} ₴</td>
                                <td>
                                    <Form.Select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}>
                                        <option value="NEW">🆕 Нове</option><option value="IN_PROGRESS">⚙️ В роботі</option><option value="COMPLETED">✅ Виконано</option><option value="CANCELLED">❌ Скасовано</option>
                                    </Form.Select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Tab>

                {/* --- Вкл. 3: МОДЕРАЦІЯ --- */}
                <Tab eventKey="reviews" title={`Модерація (${pendingReviews.length})`}>
                    {pendingReviews.length === 0 ? <Alert variant="success">Всі відгуки перевірені!</Alert> : (
                        <Table bordered hover>
                            <thead className="table-light">
                            <tr>
                                <th style={{width: '10%'}}>Тип</th>
                                <th style={{width: '20%'}}>Автор</th>
                                <th style={{width: '40%'}}>Зміст</th>
                                <th style={{width: '30%'}}>Дії</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pendingReviews.map(r => (
                                <tr key={r.id}>
                                    <td className="align-middle">
                                        <Badge bg={r.type === 'REVIEW' ? 'primary' : 'info'}>
                                            {r.type === 'REVIEW' ? 'Відгук' : 'Питання'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="fw-bold">{r.user.firstname} {r.user.lastname}</div>
                                        <small className="text-muted">{r.user.email}</small>
                                        <br/>
                                        <Button variant="link" className="text-danger p-0 sm-text" style={{fontSize: '12px'}} onClick={() => toggleBan(r.user.id)}>
                                            [Забанити]
                                        </Button>
                                    </td>
                                    <td>
                                        <div className="mb-2">
                                            <small className="text-muted fw-bold">{r.product ? r.product.name : 'ID: ' + r.id}</small>
                                            {r.rating > 0 && <div className="text-warning">{'⭐'.repeat(r.rating)}</div>}
                                            <div className="mt-1">{r.text}</div>
                                        </div>

                                        {/* ПОЛЕ ДЛЯ ВІДПОВІДІ */}
                                        <Form.Control
                                            size="sm"
                                            placeholder="Напишіть відповідь адміністратора..."
                                            value={replyText[r.id] || ''}
                                            onChange={e => setReplyText({...replyText, [r.id]: e.target.value})}
                                            className="mt-2 bg-light"
                                        />
                                    </td>
                                    <td className="align-middle">
                                        <div className="d-flex flex-column gap-2">
                                            {/* Кнопка "Відповісти" */}
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleSendReply(r.id)}
                                                disabled={!replyText[r.id]} // Неактивна, якщо пуста
                                            >
                                                💬 Відповісти
                                            </Button>

                                            <div className="d-flex gap-2 mt-2">
                                                <Button variant="success" size="sm" className="w-100" onClick={() => moderateReview(r.id, 'APPROVED')}>
                                                    Схвалити
                                                </Button>
                                                <Button variant="danger" size="sm" className="w-100" onClick={() => moderateReview(r.id, 'REJECTED')}>
                                                    Відхилити
                                                </Button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    )}
                </Tab>

                {/* --- КОРИСТУВАЧІ --- */}
                <Tab eventKey="users" title="Користувачі">
                    <Table striped>
                        <thead><tr><th>ID</th><th>Email</th><th>Роль</th><th>Статус</th><th>Дія</th></tr></thead>
                        <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.id}</td><td>{u.email}</td><td>{u.role}</td>
                                <td>{u.banned ? <Badge bg="danger">BANNED</Badge> : <Badge bg="success">ACTIVE</Badge>}</td>
                                <td>{u.role !== 'ADMIN' && <Button variant={u.banned ? "success" : "outline-danger"} size="sm" onClick={() => toggleBan(u.id)}>{u.banned ? "Розблокувати" : "Заблокувати"}</Button>}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>

            {/* --- МОДАЛЬНЕ ВІКНО ДОДАВАННЯ/РЕДАГУВАННЯ --- */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{productForm.id ? '✏️ Редагування товару' : '➕ Додавання товару'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSaveProduct}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Назва</Form.Label>
                                    <Form.Control required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ціна</Form.Label>
                                    <Form.Control type="number" required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Категорія</Form.Label>
                            <Form.Select required value={productForm.categoryId} onChange={handleCategoryChange} disabled={!!productForm.id}>
                                <option value="">Оберіть категорію</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </Form.Select>
                            {productForm.id && <Form.Text className="text-muted">Категорію не можна змінити при редагуванні.</Form.Text>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Фото URL</Form.Label>
                            <Form.Control value={productForm.imageUrl} onChange={e => setProductForm({...productForm, imageUrl: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Опис</Form.Label>
                            <Form.Control as="textarea" rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                        </Form.Group>

                        {/* Динамічні поля */}
                        {selectedCategoryName && CATEGORY_TEMPLATES[selectedCategoryName] && (
                            <div className="bg-light p-3 rounded border mb-3">
                                <h6>Характеристики ({selectedCategoryName})</h6>
                                <Row>
                                    {CATEGORY_TEMPLATES[selectedCategoryName].map(fieldKey => (
                                        <Col md={6} key={fieldKey} className="mb-2">
                                            <Form.Label className="small fw-bold text-capitalize">{fieldKey.replace('_', ' ')}</Form.Label>
                                            <Form.Control required value={specs[fieldKey] || ''} onChange={e => setSpecs({...specs, [fieldKey]: e.target.value})} />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Скасувати</Button>
                            <Button variant="success" type="submit">Зберегти</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}