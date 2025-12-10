import { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext);

    return (
        <Card className="h-100 product-card-hover">
            <Link to={`/product/${product.id}`} className="text-decoration-none" style={{ position: 'relative', display: 'block' }}>
                <div style={{ height: '220px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Card.Img
                        variant="top"
                        src={product.imageUrl || "https://via.placeholder.com/300"}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                </div>
            </Link>
            <Card.Body className="d-flex flex-column pt-0">
                {/* Категорія дрібним шрифтом */}
                <div className="text-muted small mb-2 text-uppercase fw-bold" style={{fontSize: '0.75rem'}}>
                    {product.category?.name || 'Комплектуючі'}
                </div>

                <Card.Title as={Link} to={`/product/${product.id}`} className="text-decoration-none text-dark fs-6 fw-bold mb-3" style={{ lineHeight: '1.4' }}>
                    {product.name}
                </Card.Title>

                <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-dark fw-bold mb-0">{product.price} ₴</h4>
                    </div>
                    <Button variant="success" className="w-100 fw-bold py-2" onClick={() => addToCart(product)}>
                        В кошик 🛒
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}