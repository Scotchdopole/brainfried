import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

const safeParseFloat = (value) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            if (localData) {
                const parsedData = JSON.parse(localData);
                return parsedData.map(item => ({
                    ...item,
                    price: safeParseFloat(item.price),
                    quantity: safeParseFloat(item.quantity)
                }));
            }
            return [];
        } catch (error) {
            console.error("Failed to parse cartItems from localStorage, clearing cart:", error);
            localStorage.removeItem('cartItems');
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } catch (e) {
            console.error("Error saving cart to localStorage (likely cyclic object or quota exceeded):", e, cartItems);
        }
    }, [cartItems]);

    const addToCart = (product, quantity) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product._id);

            const itemToStore = {
                id: product._id,
                name: product.name,
                price: safeParseFloat(product.price),
                imageUrl: product.imageUrl,
            };

            const parsedQuantity = safeParseFloat(quantity);

            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product._id
                        ? { ...item, quantity: item.quantity + parsedQuantity }
                        : item
                );
            } else {
                return [...prevItems, { ...itemToStore, quantity: parsedQuantity }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        setCartItems(prevItems => {
            const parsedNewQuantity = safeParseFloat(newQuantity);

            if (parsedNewQuantity < 1) {
                return prevItems.map(item =>
                    item.id === productId ? { ...item, quantity: 1 } : item
                );
            }

            return prevItems.map(item =>
                item.id === productId ? { ...item, quantity: parsedNewQuantity } : item
            );
        });
    };
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            const itemPrice = safeParseFloat(item.price);
            const itemQuantity = safeParseFloat(item.quantity);
            return total + itemPrice * itemQuantity;
        }, 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => {
            const itemQuantity = safeParseFloat(item.quantity);
            return total + itemQuantity;
        }, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                getTotalPrice,
                getTotalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};