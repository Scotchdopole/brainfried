import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Banner from '../../components/Banner/Banner'

export default function Home() {
    return (
        <div className='min-h-screen min-w-screen bg-base-300 flex flex-col'>
            <Banner></Banner>
            <Navbar></Navbar>
            <div className="hero bg-base mt-60 w-full mx-auto lg:max-w-3/4 rounded-t-4xl grow items-start pt-20">
                <div className="hero-content flex-col lg:flex-row-reverse w-full justify-between">
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                        className="max-w-sm rounded-lg shadow-2xl"
                    />
                    <div>
                        <h1 className="text-6xl font-thin">Fry your fit with</h1>
                        <h1 className="text-7xl font-extrabold lg:text-9xl">Brainfried</h1>
                        <p className="py-6">

                        </p>
                        <button className="btn btn-soft btn-primary">Shop Now</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
