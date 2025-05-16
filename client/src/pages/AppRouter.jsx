import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home/Home'
import BrainrotTest from './BrainrotTest/BrainrotTest'
import ProductPage from './ProductPage/ProductPage'
import ProductDetail from "./ProductDetail/ProductDetail"


export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Home/>} path='/' />
                <Route element={<BrainrotTest/>} path='/test' />
                <Route element={<ProductPage/>} path='/explore' />
                <Route element={<ProductDetail/>} path='/product/:productId' />
            </Routes>
        </BrowserRouter>
    )
}
