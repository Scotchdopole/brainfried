import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from '../../authContext';
import { Toaster, toast } from 'react-hot-toast';
import sahur from "../../assets/Images/sahur.png";

export default function Home() {
    const { isLoggedIn } = useAuth();

    return (
        <div className='min-h-screen bg-base-300 flex flex-col'>
            <Navbar />
            <Toaster />

            <main className="flex flex-col items-center justify-center flex-grow py-6 px-4">
                <div className="bg-gradient-to-b from-base-100 to-base-300 p-8 sm:p-10 md:p-12 lg:p-16 rounded-4xl shadow-2xl text-center mb-8 sm:mb-10">
                    <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[150px] font-extrabold tracking-tight text-white leading-none">
                        Brainfried
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-8 sm:gap-10 md:gap-12 px-4">
                    <div className="flex-1 flex justify-center p-2 sm:p-4">
                        <img
                            src={sahur}
                            alt="Brainfried character"
                            className="h-auto max-h-60 sm:max-h-72 md:max-h-80 lg:max-h-[400px] w-auto object-contain"
                        />
                    </div>
                    <div className="flex-1 flex justify-center p-2 sm:p-4">
                        <button className="btn btn-soft btn-primary w-60 sm:w-64 md:w-72 lg:w-80 h-14 sm:h-16 text-lg sm:text-xl md:text-2xl px-6 sm:px-8 rounded-3xl transition-all duration-300 ease-in-out hover:scale-105">
                            Shop Now
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}