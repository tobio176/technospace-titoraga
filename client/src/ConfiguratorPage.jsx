import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal, Badge, ProgressBar, Form } from 'react-bootstrap';
import { CartContext} from "./context/CartContext.jsx";
import { useNavigate } from 'react-router-dom';

export default function ConfiguratorPage() {
    const [allProducts, setAllProducts] = useState([]);
    const [selectedComponents, setSelectedComponents] = useState({});

    const [isAssemblySelected, setIsAssemblySelected] = useState(false);
    const [assemblyServiceProduct, setAssemblyServiceProduct] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [currentSlotKey, setCurrentSlotKey] = useState(null);

    const { addBatchToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const CONFIG_SLOTS = [
        { key: 'cpu', name: 'Процесор', category: 'Процесори', required: true, icon: '🧠' },
        { key: 'motherboard', name: 'Материнська плата', category: 'Материнські плати', required: true, icon: '🔌' },
        { key: 'ram', name: 'Оперативна пам\'ять', category: 'ОЗУ', required: true, icon: '💾' },
        { key: 'gpu', name: 'Відеокарта', category: 'Відеокарти', required: false, icon: '🎮' },
        { key: 'ssd', name: 'SSD Накопичувач', category: 'SSD накопичувачі', required: true, icon: '💽' },
        { key: 'psu', name: 'Блок живлення', category: 'Блоки живлення', required: true, icon: '⚡' },
        { key: 'case', name: 'Корпус', category: 'Корпуси', required: true, icon: '📦' },
        { key: 'monitor', name: 'Монітор', category: 'Монітори', required: false, icon: '🖥️' }
    ];

    useEffect(() => {
        axios.get('http://localhost:8080/api/products')
            .then(res => {
                setAllProducts(res.data);
                // Знаходимо товар "Збірка" в базі даних
                const service = res.data.find(p => p.name.includes("Збірка ПК"));
                if (service) {
                    setAssemblyServiceProduct(service);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const getSpecs = (product) => {
        try {
            return product.specifications ? JSON.parse(product.specifications) : {};
        } catch (e) {
            return {};
        }
    };

    const getCompatibleProducts = (slotKey) => {
        const slotConfig = CONFIG_SLOTS.find(s => s.key === slotKey);
        if (!slotConfig) return [];

        let candidates = allProducts.filter(p => p.category && p.category.name === slotConfig.category);

        if (slotKey === 'motherboard' && selectedComponents.cpu) {
            const cpuSocket = getSpecs(selectedComponents.cpu).socket;
            if (cpuSocket) {
                candidates = candidates.filter(m => getSpecs(m).socket === cpuSocket);
            }
        }

        if (slotKey === 'cpu' && selectedComponents.motherboard) {
            const moboSocket = getSpecs(selectedComponents.motherboard).socket;
            if (moboSocket) {
                candidates = candidates.filter(c => getSpecs(c).socket === moboSocket);
            }
        }

        return candidates;
    };

    const handleSelectProduct = (product) => {
        if (currentSlotKey === 'cpu' && selectedComponents.motherboard) {
            const newSocket = getSpecs(product).socket;
            const moboSocket = getSpecs(selectedComponents.motherboard).socket;

            if (newSocket !== moboSocket) {
                alert(`⚠️ Увага! Ви змінили процесор на сокет ${newSocket}. Ваша материнська плата (${moboSocket}) була автоматично видалена.`);
                setSelectedComponents(prev => ({ ...prev, [currentSlotKey]: product, motherboard: null }));
                setShowModal(false);
                return;
            }
        }

        setSelectedComponents(prev => ({ ...prev, [currentSlotKey]: product }));
        setShowModal(false);
    };

    const handleRemoveComponent = (key) => {
        const newSelection = { ...selectedComponents };
        delete newSelection[key];
        setSelectedComponents(newSelection);
    };

    // Розрахунок ціни
    const componentsPrice = Object.values(selectedComponents).reduce((sum, item) => sum + (item ? item.price : 0), 0);
    const totalPrice = componentsPrice + (isAssemblySelected && assemblyServiceProduct ? assemblyServiceProduct.price : 0);

    const requiredSlots = CONFIG_SLOTS.filter(s => s.required);
    const filledRequired = requiredSlots.filter(s => selectedComponents[s.key]);
    const isComplete = filledRequired.length === requiredSlots.length;

    const progress = Math.round((Object.keys(selectedComponents).length / CONFIG_SLOTS.length) * 100);

    const handleAddConfigToCart = () => {
        const itemsToAdd = [...Object.values(selectedComponents)];

        // Додаємо послугу, тільки якщо галочка стоїть І товар знайдено в БД
        if (isAssemblySelected && assemblyServiceProduct) {
            itemsToAdd.push(assemblyServiceProduct);
        }

        addBatchToCart(itemsToAdd);
        alert("✅ Конфігурація додана в кошик!");
        navigate('/cart');
    };

    return (
        <Container className="mt-4 mb-5">
            <div className="text-center mb-4">
                <h1>🛠️ Майстер збірки ПК <Badge bg="primary">Beta</Badge></h1>
                <p className="text-muted">Оберіть компоненти, а ми зберемо ПК для вас</p>
            </div>

            <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                    <span>Прогрес збірки:</span>
                    <span className="fw-bold">{totalPrice} ₴</span>
                </div>
                <ProgressBar now={progress} label={`${progress}%`} variant={isComplete ? "success" : "info"} animated />
            </div>

            <Row>
                <Col lg={8}>
                    {CONFIG_SLOTS.map(slot => {
                        const selectedItem = selectedComponents[slot.key];

                        return (
                            <Card key={slot.key} className={`mb-3 shadow-sm ${selectedItem ? 'border-success' : ''}`}>
                                <Card.Body className="d-flex align-items-center justify-content-between p-3">
                                    <div className="d-flex align-items-center">
                                        <div className="fs-1 me-3 text-center" style={{width: '60px'}}>{slot.icon}</div>
                                        <div>
                                            <h5 className="mb-1">
                                                {slot.name}
                                                {slot.required && <span className="text-danger">*</span>}
                                            </h5>
                                            {selectedItem ? (
                                                <div>
                                                    <span className="fw-bold text-primary">{selectedItem.name}</span>
                                                    <div className="text-muted small">
                                                        {selectedItem.price} ₴
                                                        {getSpecs(selectedItem).socket && ` | Сокет: ${getSpecs(selectedItem).socket}`}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-muted fst-italic">Не обрано</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        {selectedItem ? (
                                            <div className="d-flex gap-2">
                                                <Button variant="outline-secondary" size="sm" onClick={() => { setCurrentSlotKey(slot.key); setShowModal(true); }}>
                                                    🔄
                                                </Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleRemoveComponent(slot.key)}>
                                                    ❌
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button variant="primary" onClick={() => { setCurrentSlotKey(slot.key); setShowModal(true); }}>
                                                + Обрати
                                            </Button>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        );
                    })}
                </Col>

                <Col lg={4}>
                    <Card className="shadow-sm position-sticky" style={{top: '100px'}}>
                        <Card.Header className="bg-dark text-white">
                            <h5 className="mb-0">Ваша конфігурація</h5>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled mb-3">
                                {Object.entries(selectedComponents).map(([key, item]) => (
                                    <li key={key} className="d-flex justify-content-between mb-2 small border-bottom pb-1">
                                        <span style={{maxWidth: '200px'}}>{item.name}</span>
                                        <span className="fw-bold text-nowrap ms-2">{item.price} ₴</span>
                                    </li>
                                ))}
                            </ul>

                            {/* --- ЧЕКБОКС ПОСЛУГИ --- */}
                            {assemblyServiceProduct && (
                                <div className="bg-light p-3 rounded border mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        id="assembly-check"
                                        checked={isAssemblySelected}
                                        onChange={(e) => setIsAssemblySelected(e.target.checked)}
                                        label={
                                            <div>
                                                <div className="fw-bold lh-sm mb-1">
                                                    {assemblyServiceProduct.name}
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <Badge bg="danger" className="me-2">Акція!</Badge>
                                                    <span className="text-muted text-decoration-line-through me-2 small">
                                                        1000 ₴
                                                    </span>
                                                    <span className="fw-bold text-success">
                                                        {assemblyServiceProduct.price} ₴
                                                    </span>
                                                </div>
                                            </div>
                                        }
                                    />
                                </div>
                            )}

                            <div className="d-flex justify-content-between align-items-end mt-4 mb-3">
                                <span className="text-muted">Разом:</span>
                                <h3 className="mb-0 text-primary">{totalPrice} ₴</h3>
                            </div>

                            <div className="d-grid gap-2">
                                <Button
                                    variant="success"
                                    size="lg"
                                    disabled={!isComplete}
                                    onClick={handleAddConfigToCart}
                                >
                                    {isComplete ? "Додати все в кошик 🛒" : "Заповніть обов'язкові поля"}
                                </Button>
                                {!isComplete && (
                                    <small className="text-center text-danger">
                                        * Оберіть всі компоненти з позначкою
                                    </small>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Оберіть: {CONFIG_SLOTS.find(s => s.key === currentSlotKey)?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{maxHeight: '70vh', overflowY: 'auto'}}>
                    {getCompatibleProducts(currentSlotKey).length > 0 ? (
                        <Row>
                            {getCompatibleProducts(currentSlotKey).map(product => (
                                <Col md={6} key={product.id} className="mb-3">
                                    <Card className="h-100 cursor-pointer product-card-hover" onClick={() => handleSelectProduct(product)}>
                                        <Card.Body className="d-flex align-items-center">
                                            <img
                                                src={product.imageUrl || "https://via.placeholder.com/100"}
                                                alt={product.name}
                                                style={{width: '80px', height: '80px', objectFit: 'contain'}}
                                                className="me-3"
                                            />
                                            <div>
                                                <h6 className="mb-1">{product.name}</h6>
                                                <div className="text-danger fw-bold">{product.price} ₴</div>
                                                <small className="text-muted">
                                                    {getSpecs(product).socket && `Сокет: ${getSpecs(product).socket}`}
                                                    {getSpecs(product).watt && ` | ${getSpecs(product).watt}`}
                                                </small>
                                            </div>
                                            <Button size="sm" variant="outline-primary" className="ms-auto">Обрати</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="text-center py-5">
                            <h4>На жаль, сумісних товарів не знайдено 😢</h4>
                            <p>Спробуйте змінити інші компоненти збірки.</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
}