import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem } from '../models/CartItem';
import { orderService } from '../services/OrderService';

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    updateCart: (newCart: CartItem[]) => void;
    clearCart: () => void;
    order: () => void;
}

const CartContext = createContext<CartContextType>({
    cart: [],
    addToCart: () => { },
    updateCart: () => { },
    clearCart: () => { },
    order: () => { },
});

export const useCart = () => useContext(CartContext);

interface Props {
    children: ReactNode;
}

export const CartProvider: React.FC<Props> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id && cartItem.annotations === item.annotations);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id && cartItem.annotations === item.annotations
                        ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                        : cartItem
                );
            } else {
                return [...prevCart, item];
            }
        });
    };

    const updateCart = (newCart: CartItem[]) => {
        setCart(newCart);
    };

    const clearCart = () => {
        setCart([]);
    };

    const order = () => {
        orderService.order(cart);
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, updateCart, clearCart, order }}>
            {children}
        </CartContext.Provider>
    );
};
