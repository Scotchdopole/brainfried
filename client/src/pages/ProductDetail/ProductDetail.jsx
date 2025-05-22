import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import { useCart } from "../../cartContext.jsx";
import toast from 'react-hot-toast';

export default function ProductDetail() {
    const [productData, setProductData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [quantity, setQuantity] = useState(1);
    const { productId } = useParams();
    const { addToCart } = useCart();

    useEffect(() => {
        const getProductData = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/products/${productId}`);
                console.log(data);
                if (data && data.payload) {
                    setProductData(data.payload);
                    console.log(data.payload.name);
                } else {
                    console.warn('API response payload is not valid:', data);
                    setProductData({});
                }
            } catch (error) {
                console.error('error loading data:', error);
                setError('Failed to load products.');
            } finally {
                setLoading(false);
            }
        };
        getProductData();
    }, [productId]);

    const handleDecrement = () => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity - 1));
    };

    const handleIncrement = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1) {
            setQuantity(value);
        } else if (e.target.value === '') {
            setQuantity('');
        }
    };

    const handleBlur = (e) => {
        if (e.target.value === '' || isNaN(parseInt(e.target.value, 10)) || parseInt(e.target.value, 10) < 1) {
            setQuantity(1);
        }
    };

    const handleAddToCart = () => {
        if (quantity > 0) {
            console.log("Product data BEFORE adding to cart:", productData);
            console.log("Expected properties:", productData.id, productData.name, productData.price, productData.imageUrl);

            addToCart(productData, quantity);
            toast.success("Product was added to your cart", {
                style: {
                    borderRadius: '10px',
                    background: '#191e24',
                    color: '#fff',
                },
                position: "top-center",
                duration: 5000
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen min-w-screen bg-base-300 flex flex-col">
                <Navbar />
                <div className="flex justify-center items-center flex-grow">
                    <span className="loading loading-infinity loading-xl">Loading product...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen min-w-screen bg-base-300 flex flex-col">
                <Navbar />
                <div className="flex justify-center items-center flex-grow">
                    <span className="font-bold text-red-500">Error: {error}</span>
                </div>
            </div>
        );
    }

    if (!productData || Object.keys(productData).length === 0) {
        return (
            <div className="min-h-screen min-w-screen bg-base-300 flex flex-col">
                <Navbar />
                <div className="flex justify-center items-center flex-grow">
                    <span className="font-bold">No product found.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen min-w-screen bg-base-300 flex flex-col pb-20">
            <Navbar />
            <div className="flex flex-col md:flex-row w-11/12 lg:w-5xl h-auto md:h-[500px] mx-auto mt-10 md:mt-40 shadow-2xl rounded-3xl overflow-hidden">
                <div className="w-full md:w-1/2 aspect-video rounded-t-3xl md:aspect-square border-4 border-base-100 lg:rounded-l-3xl md:rounded-r-none flex justify-center items-center p-4 md:p-0">
                    <img className="w-full h-full object-contain" src={productData.imageUrl} alt={productData.name} />
                </div>
                <div className="bg-base-100 rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none w-full md:w-1/2 py-5 px-5 md:px-10 flex flex-col justify-between">
                    <div>
                        <p className="font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">{productData.name}</p>
                        <p className="text-sm sm:text-base mt-2 md:mt-10 max-h-50 overflow-y-auto">{productData.desc}</p>
                    </div>
                    <div className="mt-5">
                        <p className="font-bold text-4xl sm:text-5xl mb-5">
                            {productData.price} <span className="font-medium text-xl sm:text-2xl">Kč</span>
                        </p>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-row gap-2 w-full">
                                <div className="flex items-center border border-primary rounded-2xl overflow-hidden min-w-[90px]">
                                    <button
                                        className="btn h-10 btn-ghost transition-all duration-300 rounded-none btn-primary btn-sm px-2 flex-shrink-0"
                                        onClick={handleDecrement}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        onBlur={handleBlur}
                                        className="input input-ghost w-10 max-w-[40px] focus:outline-none input-primary input-sm text-center px-0"
                                        min="1"
                                    />
                                    <button
                                        className="btn h-10 btn-ghost transition-all duration-300 rounded-none btn-primary btn-sm px-2 flex-shrink-0"
                                        onClick={handleIncrement}
                                    >
                                        +
                                    </button>
                                </div>
                                <button className="btn rounded-2xl btn-primary flex-1" onClick={handleAddToCart}>Add to cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}