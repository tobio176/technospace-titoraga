import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
    return (
        <footer className="bg-dark text-light py-4 mt-auto">
            <Container>
                <Row>
                    <Col md={4} className="mb-3">
                        <h5 className="text-white fw-bold">TechnoSpace 🚀</h5>
                        <p className="text-white-50 small">
                            Ваш надійний партнер у світі комп'ютерної техніки.
                            Збираємо мрії з 2025 року.
                        </p>
                    </Col>
                    <Col md={4} className="mb-3">
                        <h5 className="text-white fw-bold">Контакти</h5>
                        <ul className="list-unstyled text-white-50 small">
                            <li className="mb-1">📍 Україна, м. Одеса, вул. Дерибасівська, 1</li>
                            <li className="mb-1">📞 +38 (099) 123-45-67</li>
                            <li className="mb-1">📧 support@technospace.ua</li>
                        </ul>
                    </Col>
                    <Col md={4} className="mb-3">
                        <h5 className="text-white fw-bold">Час роботи</h5>
                        <ul className="list-unstyled text-white-50 small">
                            <li className="mb-1">Пн-Пт: 09:00 - 20:00</li>
                            <li className="mb-1">Сб-Нд: 10:00 - 18:00</li>
                            <li className="mb-1">Онлайн замовлення: 24/7</li>
                        </ul>
                    </Col>
                </Row>
                <hr className="border-secondary" />
                <div className="text-center small text-white-50">
                    &copy; 2025 TechnoSpace. Всі права захищено. Курсова робота. Тіторага Глєб АІ-233.
                </div>
            </Container>
        </footer>
    );
}