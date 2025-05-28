
import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Toaster, toast } from 'react-hot-toast';

export default function CheckoutForm() {

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Form Submitted (Static):", formData);

        if (!formData.fullName || !formData.email || !formData.address || !formData.city || !formData.zipCode) {
            toast.error("Please fill in all required contact and shipping details.", {
                style: { borderRadius: '10px', background: '#191e24', color: '#fff' },
                position: "top-center",
                duration: 4000
            });
            return;
        }


        toast.success("Form submitted! (This is a static demonstration)", {
            style: {
                borderRadius: '10px',
                background: '#191e24',
                color: '#fff',
            },
            position: "top-center",
            duration: 5000
        });

        setFormData({
            fullName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            zipCode: '',
            message: ''
        });

    };

    return (
        <div className="min-h-screen bg-base-300 text-white flex flex-col">
            <Toaster />
            <Navbar />

            <main className="flex flex-col items-center flex-grow py-10 px-4">

                <h1 className='font-font1 text-5xl font-bold mb-10'>Admin Panel</h1>
                <div className="w-full max-w-2xl bg-base-100 p-8 rounded-3xl shadow-lg">
                    <div className="flex flex-col space-y-6">

                        <form onSubmit={handleSubmit} className="space-y-6 w-full">
                            <div className="w-full">
                                <label htmlFor="fullName" className="block text-lg font-medium mb-2 text-left">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="input input-bordered input-primary h-12 w-full focus-within:outline-transparent rounded-2xl"
                                    required
                                />
                            </div>

                            <div className="w-full">
                                <label htmlFor="email" className="block text-lg font-medium mb-2 text-left">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john.doe@example.com"
                                    className="input input-bordered input-primary h-12 w-full focus-within:outline-transparent rounded-2xl"
                                    required
                                />
                            </div>

                            <div className="w-full">
                                <label htmlFor="phone" className="block text-lg font-medium mb-2 text-left">Phone (Optional)</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+420 123 456 789"
                                    className="input input-bordered input-primary h-12 w-full focus-within:outline-transparent rounded-2xl"
                                />
                            </div>

                            <div className="w-full">
                                <label htmlFor="address" className="block text-lg font-medium mb-2 text-left">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Street 123"
                                    className="input input-bordered input-primary h-12 w-full focus-within:outline-transparent rounded-2xl"
                                    required
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 w-full">
                                <div className="w-full sm:w-1/2">
                                    <label htmlFor="city" className="block text-lg font-medium mb-2 text-left">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Prague"
                                        className="input input-bordered input-primary h-12 w-full focus-within:outline-transparent rounded-2xl"
                                        required
                                    />
                                </div>
                                <div className="w-full sm:w-1/2">
                                    <label htmlFor="zipCode" className="block text-lg font-medium mb-2 text-left">Zip Code</label>
                                    <input
                                        type="text"
                                        id="zipCode"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        placeholder="10000"
                                        className="input input-bordered input-primary h-12 w-full focus-within:outline-transparent rounded-2xl"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="w-full">
                                <label htmlFor="message" className="block text-lg font-medium mb-2 text-left">Order Notes (Optional)</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Any special instructions or delivery preferences?"
                                    className="textarea textarea-bordered textarea-primary w-full bg-base-300 text-white rounded-2xl"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className='btn rounded-2xl btn-primary w-full text-xl py-3 mt-6'
                            >
                                Confirm Details
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}