import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home/Home'
import BrainrotTest from './BrainrotTest/BrainrotTest'
import ProductPage from './ProductPage/ProductPage'
import ProductDetail from "./ProductDetail/ProductDetail"
import Game from "./Game/Game"
import LoginFrom from './LoginForm/LoginForm'
import RegisterForm from './RegisterPage/RegisterPage'
import Cart from './Cart/Cart'


export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Home />} path='/' />
                <Route element={<BrainrotTest />} path='/test' />
                <Route element={<ProductPage />} path='/explore' />
                <Route element={<ProductDetail />} path='/product/:productId' />
                <Route element={<Game />} path='/game' />
                <Route element={<LoginFrom />} path='/login' />
                <Route element={<RegisterForm />} path='/register' />
                <Route element={<Cart />} path='/cart' />
            </Routes>
        </BrowserRouter>
    )
}
