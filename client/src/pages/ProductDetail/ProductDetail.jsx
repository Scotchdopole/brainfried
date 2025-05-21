import React, { useEffect, useState } from 'react'
import { useParams } from "react-router"
import axios from "axios"
import Navbar from '../../components/Navbar/Navbar';

export default function ProductDetail() {

    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const { productId } = useParams();

    useEffect(() => {
        const getProductData = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/products/${productId}`);
                console.log(data)
                if (data) {
                    setProductData(data.payload);
                    console.log(data.payload.name);
                    setLoading(false)
                } else {
                    console.warn("API response payload is not an array:", data);
                    setProductData([]);
                }
            } catch (error) {
                console.error("error loading data:", error);
                setError("Failed to load products.");
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
        <div className='min-h-screen min-w-screen bg-base-300 flex flex-col pb-40'>
            <Navbar></Navbar>
            <div className='flex flex-row w-5xl h-[500px] mx-auto mt-40 shadow-2xl rounded-3xl'>
                <div className='aspect-square border-4 rounded-l-3xl border-base-100 flex justify-center items-center'>
                    <img className='aspect-square w-full object-contain' src={productData.imageUrl} alt="" />
                </div>
                <div className='bg-base-100 rounded-r-3xl w-full py-5 px-10'>
                    <p className='font-bold text-5xl'>{productData.name}</p>
                    <p className='mt-10 h-50'>{productData.desc}</p>
                    <p className='font-bold text-5xl'>{productData.price} <span className='font-medium text-2xl'>Kč</span></p>
                    <div className='flex flex-col'>
                        <div className='flex flex-row gap-2 mt-10 w-full'>
                            <button className='btn btn-outline btn-primary'>-</button>
                            <input
                                type="number"
                                class="input max-w-14"
                                required
                                min="1"
                            />
                            <button className='btn btn-outline btn-primary'>+</button>
                            <button className='btn btn-primary flex-1'>Add to cart</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}
