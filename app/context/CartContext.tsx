import React, { createContext, useState, ReactNode, useContext } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (id: string, name: string, price: number) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (id: string, name: string, price: number) => {
        const existingItem = cart.find((item) => item.id === id);

        if (existingItem) {
            setCart(
                cart.map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            setCart([...cart, { id, name, price, quantity: 1 }]);
        }
    };

    const removeFromCart = (id: string) => {
        setCart((prevCart) => {
            // Find the item to check its quantity
            const itemToRemove = prevCart.find(item => item.id === id);
            
            if (itemToRemove && itemToRemove.quantity === 1) {
                // If quantity is 1, remove the item completely
                return prevCart.filter(item => item.id !== id);
            } else {
                // Otherwise, decrement the quantity
                return prevCart.map(item => 
                    item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                );
            }
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}