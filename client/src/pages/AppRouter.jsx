import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home/Home'
import BrainrotTest from './BrainrotTest/BrainrotTest'


export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Home/>} path='/' />
                <Route element={<BrainrotTest/>} path='/test' />
            </Routes>
        </BrowserRouter>
    )
}
