import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('lovebakes_cart');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    // Persist cart to localStorage on every change
    useEffect(() => {
        localStorage.setItem('lovebakes_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, size, quantity = 1, message = '') => {
        const sizeInfo = product.sizes.find(s => s.size === size) || product.sizes[0];
        const key = `${product._id}-${size}`;
        setCartItems(prev => {
            const existing = prev.find(i => i.key === key);
            if (existing) {
                return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...prev, {
                key,
                _id: product._id,
                name: product.name,
                image: product.images?.[0] || '',
                size,
                price: sizeInfo.price,
                quantity,
                message,
            }];
        });
    };

    const removeFromCart = (key) => setCartItems(prev => prev.filter(i => i.key !== key));

    const updateQuantity = (key, qty) => {
        if (qty < 1) { removeFromCart(key); return; }
        setCartItems(prev => prev.map(i => i.key === key ? { ...i, quantity: qty } : i));
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
