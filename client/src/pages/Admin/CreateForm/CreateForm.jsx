import React, { useState } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import { Toaster, toast } from 'react-hot-toast';

export default function CreateForm() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        brainrotLevel: '',
        desc: '',
        collection: '',
        image: null,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        toast.dismiss();

        const form = new FormData();
        form.append('name', formData.name);
        form.append('price', parseFloat(formData.price));
        form.append('brainrotLevel', parseInt(formData.brainrotLevel));
        form.append('desc', formData.desc);
        form.append('collection', formData.collection);
        if (formData.image) {
            form.append('image', formData.image);
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/createProduct`, {
                method: 'POST',
                body: form,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Product created successfully!', {
                    style: {
                        borderRadius: '10px',
                        background: '#191e24',
                        color: '#fff',
                    },
                    position: "top-center",
                    duration: 5000
                });
                setFormData({
                    name: '',
                    price: '',
                    brainrotLevel: '',
                    desc: '',
                    collection: '',
                    image: null,
                });
                e.target.reset();
            } else {
                toast.error(data.message || 'Failed to create product.', {
                    style: {
                        borderRadius: '10px',
                        background: '#191e24',
                        color: '#fff',
                    },
                    position: "top-center",
                    duration: 5000
                });
            }
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error('An error occurred. Please try again.', {
                style: {
                    borderRadius: '10px',
                    background: '#191e24',
                    color: '#fff',
                },
                position: "top-center",
                duration: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-base-300 text-white flex flex-col'>
            <Navbar />
            <Toaster />

            <main className="flex flex-col items-center flex-grow py-10 px-4">

                <div className="w-full max-w-2xl bg-base-100 p-8 rounded-3xl shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center w-full">
                        <div className="w-full">
                            <label htmlFor="name" className="block text-lg font-medium mb-2 text-left">Product Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                className="input input-bordered input-primary h-12 w-full focus-within:outline-transparent rounded-2xl"
                                required
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="price" className="block text-lg font-medium mb-2 text-left">Price ($)</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                step="0.01"
                                placeholder="Enter price"
                                className="input input-bordered input-primary h-12 w-full focus-within:outline-transparent rounded-2xl"
                                required
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="brainrotLevel" className="block text-lg font-medium mb-2 text-left">Brainrot Level (1-100)</label>
                            <input
                                type="number"
                                id="brainrotLevel"
                                name="brainrotLevel"
                                value={formData.brainrotLevel}
                                onChange={handleChange}
                                min="1"
                                max="100"
                                placeholder="Enter brainrot level"
                                className="input input-bordered input-primary h-12 w-full focus-within:outline-transparent rounded-2xl"
                                required
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="collection" className="block text-lg font-medium mb-2 text-left">Collection</label>
                            <input
                                type="text"
                                id="collection"
                                name="collection"
                                value={formData.collection}
                                onChange={handleChange}
                                placeholder="Enter collection name"
                                className="input input-bordered input-primary h-12 w-full focus-within:outline-transparent rounded-2xl"
                                required
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="desc" className="block text-lg font-medium mb-2 text-left">Description</label>
                            <textarea
                                id="desc"
                                name="desc"
                                value={formData.desc}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Enter product description"
                                className="textarea textarea-bordered textarea-primary w-full bg-base-300 text-white rounded-2xl"
                                required
                            ></textarea>
                        </div>

                        <div className="w-full">
                            <label htmlFor="image" className="block text-lg font-medium mb-2 text-left">Product Image</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={handleChange}
                                className="file-input file-input-bordered file-input-primary w-full bg-base-300 text-white rounded-2xl"
                            />
                            {formData.image && (
                                <p className="text-sm text-gray-400 mt-2 text-left">Selected: {formData.image.name}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className='btn rounded-2xl btn-primary mt-8 w-3/4 md:w-1/2 text-xl py-3'
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Creating...
                                </>
                            ) : (
                                'Create Product'
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}