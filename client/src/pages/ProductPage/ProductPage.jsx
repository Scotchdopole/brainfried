import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import ProductCard from "../../components/ProductCard/ProductCard";
import Navbar from '../../components/Navbar/Navbar';

export default function ProductPage() {

    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getProductData = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/products/');
                if (data && Array.isArray(data.payload)) {
                    setProductData(data.payload);
                } else {
                    console.warn("API response payload is not an array:", data);
                    setProductData([]);
                }
                console.log(data.payload);
            } catch (error) {
                console.error("error loading data:", error);
                setError("Failed to load products.");
            } finally {
                setLoading(false);
            }
        };
        getProductData();
    }, []);


    if (loading) {
        return (
            <div className="min-h-screen min-w-screen bg-base-300 flex flex-col">
                <Navbar></Navbar>
                <div className='flex justify-center mt-[-200px] min-h-screen'><span className="loading loading-infinity loading-xl">Loading products...</span></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen min-w-screen bg-base-300 flex flex-col">
                <Navbar></Navbar>
                <div className='flex justify-center items-center mt-[-200px] min-h-screen'><span className='font-bold'>Error:{error}</span></div>
            </div>
        );
    }

    if (productData.length === 0) {
        return (
            <div className="min-h-screen min-w-screen bg-base-300 flex flex-col">
                <Navbar></Navbar>
                <div className='flex justify-center items-center mt-[-200px] min-h-screen'><span className='font-bold'>No products found.</span></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen min-w-screen bg-base-300 flex flex-col pb-40">
            <Navbar></Navbar>
            <div className=' flex gap-5 flex-wrap mt-20 mx-auto justify-center' >
                {
                    productData.map(product => (
                        <div className="hover:mt-[-5px] transition-all" >
                            <ProductCard product={product} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}