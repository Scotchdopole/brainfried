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
                <div className="bg-gradient-to-b from-base-100 to-base-300 p-10 rounded-4xl shadow-2xl text-center mb-16">
                    <h1 className="text-8xl md:text-[150px] lg:text-[200px] font-extrabold tracking-tight text-white">
                        Brainfried
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-16 md:gap-20">
                    <div className="flex-1 flex justify-center">
                        <img
                            src={sahur}
                            alt="Brainfried character"
                            className="h-auto max-h-96 w-auto object-contain"
                        />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <button className="btn btn-soft btn-primary w-70 h-20 text-2xl px-16 rounded-3xl">
                            Shop Now
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}