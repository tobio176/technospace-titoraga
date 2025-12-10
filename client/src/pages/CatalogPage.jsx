import { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form, Badge, InputGroup } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function CatalogPage() {
    const [allProducts, setAllProducts] = useState([]);
    const [displayProducts, setDisplayProducts] = useState([]);
    const { categoryName } = useParams();

    // --- СТАНИ ФІЛЬТРІВ ---
    const [selectedFilters, setSelectedFilters] = useState({});
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortOption, setSortOption] = useState('price-asc');
    const [searchTerm, setSearchTerm] = useState('');

    // 1. Завантаження даних
    useEffect(() => {
        axios.get('http://localhost:8080/api/products')
            .then(res => {
                let data = res.data;
                // Фільтрація за категорією
                if (categoryName) {
                    const decodedCategory = decodeURIComponent(categoryName);
                    data = data.filter(p => p.category && p.category.name === decodedCategory);
                }
                setAllProducts(data);
                // Скидання фільтрів при зміні категорії
                setSelectedFilters({});
                setPriceRange({ min: '', max: '' });
                setSearchTerm('');
            })
            .catch(err => console.error(err));
    }, [categoryName]);

    // 2. Генерація доступних фільтрів (динамічні характеристики)
    const availableFilters = useMemo(() => {
        if (!categoryName) return {};

        const filters = {};
        allProducts.forEach(product => {
            if (product.specifications) {
                try {
                    const specs = JSON.parse(product.specifications);
                    Object.entries(specs).forEach(([key, value]) => {
                        if (!filters[key]) filters[key] = new Set();
                        filters[key].add(value);
                    });
                } catch (e) {}
            }
        });

        const sortedFilters = {};
        Object.keys(filters).forEach(key => {
            // Сортуємо значення фільтрів
            sortedFilters[key] = Array.from(filters[key]).sort((a, b) => {
                return isNaN(a) || isNaN(b) ? String(a).localeCompare(String(b)) : a - b;
            });
        });
        return sortedFilters;
    }, [allProducts, categoryName]);

    // 3. ГОЛОВНА ЛОГІКА ФІЛЬТРАЦІЇ ТА СОРТУВАННЯ
    useEffect(() => {
        let result = [...allProducts];

        // A. Пошук за назвою
        if (searchTerm) {
            result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // B. Фільтр за ціною
        if (priceRange.min) {
            result = result.filter(p => p.price >= Number(priceRange.min));
        }
        if (priceRange.max) {
            result = result.filter(p => p.price <= Number(priceRange.max));
        }

        // C. Фільтр за специфікаціями (тільки якщо є категорія)
        if (categoryName && Object.keys(selectedFilters).length > 0) {
            result = result.filter(product => {
                if (!product.specifications) return false;
                try {
                    const specs = JSON.parse(product.specifications);
                    return Object.entries(selectedFilters).every(([key, selectedValues]) => {
                        if (selectedValues.length === 0) return true;
                        return selectedValues.includes(String(specs[key]));
                    });
                } catch (e) { return false; }
            });
        }

        // D. Сортування
        switch (sortOption) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        setDisplayProducts(result);
    }, [allProducts, searchTerm, priceRange, selectedFilters, sortOption, categoryName]);

    // --- ОБРОБНИКИ ПОДІЙ ---

    const handleSpecFilterChange = (key, value) => {
        setSelectedFilters(prev => {
            const currentValues = prev[key] || [];
            if (currentValues.includes(value)) {
                return { ...prev, [key]: currentValues.filter(v => v !== value) };
            } else {
                return { ...prev, [key]: [...currentValues, value] };
            }
        });
    };

    const resetFilters = () => {
        setSelectedFilters({});
        setPriceRange({ min: '', max: '' });
        setSearchTerm('');
        setSortOption('price-asc');
    };

    const formatKey = (key) => {
        const dictionary = {
            socket: "Сокет", cores: "Ядра", frequency: "Частота", tdp: "TDP",
            memory: "Пам'ять", type: "Тип", power_req: "БЖ (мін)", capacity: "Об'єм",
            interface: "Інтерфейс", read: "Читання", write: "Запис", watt: "Потужність",
            efficiency: "Сертифікат", modular: "Модульність", form_factor: "Форм-фактор",
            resolution: "Роздільна здатність", refresh_rate: "Герцовка", panel: "Матриця",
            switch: "Свічі", wireless: "Підключення", dpi: "DPI", buttons: "Кнопки"
        };
        return dictionary[key] || key.charAt(0).toUpperCase() + key.slice(1);
    };

    return (
        <Container className="mt-4 mb-5">
            <h2 className="mb-4 d-flex align-items-center">
                {categoryName ? `📂 ${decodeURIComponent(categoryName)}` : '🛒 Каталог товарів'}
                <Badge bg="secondary" className="ms-2 fs-6 rounded-pill">{displayProducts.length}</Badge>
            </h2>

            <Row>
                {/* --- ЛІВА КОЛОНКА (САЙДБАР) --- */}
                <Col md={3} className="mb-4">
                    <div className="bg-white p-4 rounded-3 shadow-sm border border-light">

                        {/* 1. ПОШУК */}
                        <div className="mb-4">
                            <h6 className="fw-bold mb-2">Пошук</h6>
                            <Form.Control
                                type="text"
                                placeholder="Назва товару..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* 2. СОРТУВАННЯ */}
                        <div className="mb-4">
                            <h6 className="fw-bold mb-2">Сортування</h6>
                            <Form.Select
                                value={sortOption}
                                onChange={e => setSortOption(e.target.value)}
                                className="border-secondary"
                            >
                                <option value="price-asc">💵 Від дешевих</option>
                                <option value="price-desc">💰 Від дорогих</option>
                                <option value="name-asc">🔤 Назва (А-Я)</option>
                                <option value="name-desc">🔠 Назва (Я-А)</option>
                            </Form.Select>
                        </div>

                        {/* 3. ЦІНА */}
                        <div className="mb-4">
                            <h6 className="fw-bold mb-2">Ціна (грн)</h6>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    placeholder="Від"
                                    type="number"
                                    value={priceRange.min}
                                    onChange={e => setPriceRange({...priceRange, min: e.target.value})}
                                />
                                <InputGroup.Text>-</InputGroup.Text>
                                <Form.Control
                                    placeholder="До"
                                    type="number"
                                    value={priceRange.max}
                                    onChange={e => setPriceRange({...priceRange, max: e.target.value})}
                                />
                            </InputGroup>
                        </div>

                        <hr className="text-muted" />

                        {/* 4. ДИНАМІЧНІ ХАРАКТЕРИСТИКИ (Тільки якщо обрана категорія) */}
                        {categoryName && Object.keys(availableFilters).map((key) => (
                            <div key={key} className="mb-4">
                                <h6 className="fw-bold text-dark small text-uppercase mb-2">
                                    {formatKey(key)}
                                </h6>
                                <div style={{maxHeight: '150px', overflowY: 'auto'}}>
                                    {availableFilters[key].map(val => (
                                        <Form.Check
                                            key={String(val)}
                                            type="checkbox"
                                            id={`filter-${key}-${val}`}
                                            label={val === true ? "Є" : String(val)}
                                            checked={selectedFilters[key]?.includes(String(val)) || false}
                                            onChange={() => handleSpecFilterChange(key, String(val))}
                                            className="small mb-1"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}

                        <Button
                            variant="outline-danger"
                            className="w-100"
                            onClick={resetFilters}
                        >
                            🔄 Скинути все
                        </Button>
                    </div>
                </Col>

                {/* --- ПРАВА КОЛОНКА (ТОВАРИ) --- */}
                <Col md={9}>
                    <Row>
                        {displayProducts.length > 0 ? (
                            displayProducts.map(product => (
                                <Col key={product.id} lg={4} md={6} sm={6} className="mb-4">
                                    <ProductCard product={product} />
                                </Col>
                            ))
                        ) : (
                            <Col className="text-center py-5">
                                <div className="text-muted mb-3" style={{fontSize: '3rem'}}>🕵️‍♂️</div>
                                <h4>Нічого не знайдено</h4>
                                <p className="text-muted">Спробуйте змінити параметри пошуку або фільтри.</p>
                                <Button variant="primary" onClick={resetFilters}>Очистити фільтри</Button>
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}