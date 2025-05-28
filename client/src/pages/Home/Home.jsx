import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from '../../authContext';
import { Toaster, toast } from 'react-hot-toast';
import sahur from "../../assets/Images/sahur.png";

export default function Home() {
    const { isLoggedIn } = useAuth();

    return (
        <div className='min-h-screen min-w-screen bg-base-300 flex flex-col'>
            <Navbar />
            <Toaster />

            <main className="flex flex-col items-center justify-center flex-grow py-10 px-4">
                <div className="bg-gradient-to-b from-base-100 to-base-300 p-8 sm:p-10 md:p-12 lg:p-16 rounded-4xl shadow-2xl text-center mb-12 sm:mb-16">
                    <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[150px] font-extrabold tracking-tight text-white leading-none">
                        Brainfried
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-12 sm:gap-16 md:gap-20 px-4">
                    <div className="flex-1 flex justify-center p-4">
                        <img
                            src={sahur}
                            alt="Brainfried character"
                            className="h-auto max-h-72 sm:max-h-80 md:max-h-96 lg:max-h-[500px] w-auto object-contain"
                        />
                    </div>
                    <div className="flex-1 flex justify-center p-4">
                        <button className="btn btn-soft btn-primary w-64 sm:w-72 md:w-80 lg:w-96 h-16 sm:h-20 text-xl sm:text-2xl md:text-3xl px-8 sm:px-12 rounded-3xl transition-all duration-300 ease-in-out hover:scale-105">
                            Shop Now
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}