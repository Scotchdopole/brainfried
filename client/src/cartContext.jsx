// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Vytvoření Contextu
const CartContext = createContext();

// Pomocná funkce pro bezpečné parsování čísla (např. ceny)
// Zajišťuje, že pokud je vstup NaN nebo se nedá převést, vrátí 0, nikoli NaN.
const safeParseFloat = (value) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
};

// 2. Vytvoření Provideru
export const CartProvider = ({ children }) => {
    // Inicializace košíku z localStorage (pro zachování stavu po refreshu)
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            if (localData) {
                const parsedData = JSON.parse(localData);
                // Důležité: Při načítání z localStorage převést ceny zpět na čísla
                return parsedData.map(item => ({
                    ...item,
                    price: safeParseFloat(item.price), // Zajišťujeme, že cena je číslo
                    quantity: safeParseFloat(item.quantity) // Zajišťujeme, že množství je číslo
                }));
            }
            return [];
        } catch (error) {
            console.error("Failed to parse cartItems from localStorage, clearing cart:", error);
            // V případě chyby parsování localStorage vyčistíme košík, abychom předešli dalším problémům
            localStorage.removeItem('cartItems');
            return [];
        }
    });

    // Uložení košíku do localStorage při každé změně
    useEffect(() => {
        try {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } catch (e) {
            console.error("Error saving cart to localStorage (likely cyclic object or quota exceeded):", e, cartItems);
        }
    }, [cartItems]);

    // Funkce pro přidání položky do košíku
    const addToCart = (product, quantity) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product._id);

            // Zde je KLÍČOVÁ OPRAVA:
            // Explicitně vybíráme vlastnosti, které chceme uložit
            // a převádíme 'price' na číslo.
            // Zkontroluj, zda názvy vlastností (id, name, price, imageUrl)
            // přesně odpovídají těm, které dostáváš z API v `productData`.
            // Pokud se liší (např. 'productId' místo 'id'), uprav je zde.
            const itemToStore = {
                id: product._id,
                name: product.name,
                price: safeParseFloat(product.price), // ZAJISTIT, ŽE CENA JE ČÍSLO
                imageUrl: product.imageUrl,
                // Sem můžeš přidat i 'desc' nebo jiné jednoduché vlastnosti, pokud je potřebuješ
                // desc: product.desc,
            };

            const parsedQuantity = safeParseFloat(quantity); // ZAJISTIT, ŽE MNOŽSTVÍ JE ČÍSLO

            if (existingItem) {
                // Pokud položka již existuje, aktualizuj množství
                return prevItems.map(item =>
                    item.id === product._id
                        ? { ...item, quantity: item.quantity + parsedQuantity } // Použij parsované množství
                        : item
                );
            } else {
                // Jinak přidej novou položku
                return [...prevItems, { ...itemToStore, quantity: parsedQuantity }]; // Použij parsované množství
            }
        });
    };

    // Funkce pro odebrání položky z košíku
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    // Funkce pro aktualizaci množství položky
    const updateQuantity = (productId, newQuantity) => {
        setCartItems(prevItems => {
            const parsedNewQuantity = safeParseFloat(newQuantity);

            // ZABRÁNÍ SNÍŽENÍ POD 1
            if (parsedNewQuantity < 1) {
                // Pokud se snaží snížit na 0 nebo méně, nastavíme na 1
                // Košík se odstraní pouze tlačítkem "Remove"
                return prevItems.map(item =>
                    item.id === productId ? { ...item, quantity: 1 } : item
                );
            }

            return prevItems.map(item =>
                item.id === productId ? { ...item, quantity: parsedNewQuantity } : item
            );
        });
    };
    // Celková cena košíku
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            // Záchranná brzda: Ujistit se, že price a quantity jsou čísla i zde
            const itemPrice = safeParseFloat(item.price);
            const itemQuantity = safeParseFloat(item.quantity);
            return total + itemPrice * itemQuantity;
        }, 0);
    };

    // Celkový počet položek (kusů) v košíku
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => {
            const itemQuantity = safeParseFloat(item.quantity); // Ujistit se, že quantity je číslo
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

// 3. Vytvoření Custom Hooku pro snadné použití Contextu
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};