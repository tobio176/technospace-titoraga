import { useState, useEffect, useRef } from 'react';
import { Form, ListGroup, Image, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function LiveSearch() {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);

    // 1. Завантажуємо товари один раз при монтуванні (для швидкості пошуку)
    useEffect(() => {
        axios.get('https://technospace-titoraga.onrender.com/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error("Search Error:", err));
    }, []);

    // 2. Логіка пошуку
    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }

        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5); // Показуємо максимум 5 підказок

        setResults(filtered);
    }, [query, products]);

    // 3. Закриття списку при кліку поза ним
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchRef]);

    return (
        <div className="position-relative me-3 w-100" ref={searchRef} style={{ maxWidth: '400px' }}>
            <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">🔍</InputGroup.Text>
                <Form.Control
                    type="text"
                    placeholder="Я шукаю..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                    className="border-start-0"
                    style={{ boxShadow: 'none' }}
                />
            </InputGroup>

            {/* Випадаючий список результатів */}
            {showResults && results.length > 0 && (
                <ListGroup className="position-absolute w-100 shadow mt-1" style={{ zIndex: 1050, top: '100%' }}>
                    {results.map(product => (
                        <ListGroup.Item
                            key={product.id}
                            action
                            as={Link}
                            to={`/product/${product.id}`}
                            onClick={() => {
                                setShowResults(false);
                                setQuery('');
                            }}
                            className="d-flex align-items-center border-0 border-bottom"
                        >
                            <Image
                                src={product.imageUrl}
                                rounded
                                style={{ width: '40px', height: '40px', objectFit: 'contain', marginRight: '10px' }}
                            />
                            <div>
                                <div className="fw-bold small text-dark">{product.name}</div>
                                <div className="text-muted small">{product.price} ₴</div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            {showResults && query && results.length === 0 && (
                <div className="position-absolute w-100 bg-white shadow mt-1 p-2 text-center text-muted small rounded" style={{ zIndex: 1050 }}>
                    Нічого не знайдено 🕵️‍♂️
                </div>
            )}
        </div>
    );
}