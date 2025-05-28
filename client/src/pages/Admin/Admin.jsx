import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

export default function Admin() {
    return (
        <div className='min-h-screen bg-base-300 text-white flex flex-col'>
            <Navbar />

            <main className="flex flex-col items-center flex-grow py-10 px-4">
                <div className="text-center mb-10 w-full max-w-md md:max-w-xl">
                    <h1 className='font-font1 text-5xl font-bold'>Admin Panel</h1>
                </div>

                <div className="w-full max-w-lg bg-base-100 p-8 rounded-3xl shadow-lg flex flex-col items-center space-y-6">
                    <Link
                        to="/admin/create-form"
                        className="btn rounded-2xl btn-primary w-3/4 md:w-1/2 text-xl py-3" // Reusing login/form button style
                    >
                        Create Product
                    </Link>
                </div>
            </main>
        </div>
    );
}