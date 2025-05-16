import React, { useEffect, useState } from 'react'
import { useParams } from "react-router"
import axios from "axios"

export default function ProductDetail() {

    const [productData, setProductData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const { productId } = useParams();

    useEffect(() => {
        const getProductData = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/products/${productId}`);
                if (data && Array.isArray(data.payload)) {
                    setProductData(data.payload);
                    console.log(productData);
                    console.log("negr");
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


    return (
        <>
            <div>ProductDetail</div>
            <p>{productData}</p>
        </>

    )
}
