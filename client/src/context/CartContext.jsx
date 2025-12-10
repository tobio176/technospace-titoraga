import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Завантаження кошику з localStorage
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Збереження в localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Додати один товар
    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    // Додати багато товарів (з конфігуратора)
    const addBatchToCart = (productsList) => {
        setCartItems(prev => {
            let newCart = [...prev];

            productsList.forEach(product => {
                const existingIndex = newCart.findIndex(item => item.id === product.id);
                if (existingIndex !== -1) {
                    // Якщо є - збільшуємо кількість
                    newCart[existingIndex] = {
                        ...newCart[existingIndex],
                        quantity: newCart[existingIndex].quantity + 1
                    };
                } else {
                    // Якщо немає - додаємо
                    newCart.push({ ...product, quantity: 1 });
                }
            });

            return newCart;
        });
    };

    // Очистити кошик
    const clearCart = () => setCartItems([]);

    // Видалити товар
    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, addBatchToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};