import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
    const [products, setProducts] = useState([]);

    // Список категорій, які ми хочемо показати на головній
    const categoriesToShow = [
        "Процесори",
        "Відеокарти",
        "Материнські плати",
        "Монітори",
        "Клавіатури"
    ];

    useEffect(() => {
        axios.get('https://technospace-titoraga.onrender.com/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    // Допоміжна функція для рендеру секції
    const renderCategorySection = (categoryName) => {
        // Фільтруємо товари цієї категорії
        const categoryProducts = products.filter(p => p.category && p.category.name === categoryName);

        // Якщо товарів немає, не показуємо секцію
        if (categoryProducts.length === 0) return null;

        // Беремо перші 4 товари (замість 3)
        const displayProducts = categoryProducts.slice(0, 4);

        return (
            <div key={categoryName} className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="fw-bold">{categoryName}</h2>
                    <Link to={`/catalog/${categoryName}`} className="btn btn-outline-primary btn-sm">
                        Всі {categoryName} &rarr;
                    </Link>
                </div>
                <Row>
                    {/* Виводимо товари (до 4 штук) */}
                    {displayProducts.map(product => (
                        <Col key={product.id} lg={3} md={6} sm={6} className="mb-3">
                            <ProductCard product={product} />
                        </Col>
                    ))}
                </Row>
            </div>
        );
    };

    return (
        <Container className="mt-4">
            {/* Банер з фоновою картинкою */}
            <div className="p-5 mb-5 rounded-3 shadow-sm text-center text-white"
                 style={{
                     backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://www.asus.com/me-en/microsite/powered-by-asus/upload/scenario/20231127141252_pic0.jpg')`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center center',
                     minHeight: '400px',
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'center',
                     alignItems: 'center'
                 }}>
                <h1 className="display-3 fw-bold">Ласкаво просимо в TechnoSpace! 🚀</h1>
                <p className="lead mb-4">Найкращі комплектуючі для твого ідеального ПК.</p>
                <Link to="/configurator" className="btn btn-primary btn-lg px-4">Зібрати ПК зараз</Link>
            </div>

            {categoriesToShow.map(cat => renderCategorySection(cat))}
        </Container>
    );
}