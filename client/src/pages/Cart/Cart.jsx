import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { useCart } from "../../cartContext";
import { FaTrash } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

    const handleRemove = () => {
        toast.error(`Item was removed!`, {
            style: {
                borderRadius: '10px',
                background: '#191e24',
                color: '#fff',
            },
            position: "top-center",
            duration: 5000
        });
    }
    return (
        <div className="min-h-screen bg-base-300 flex flex-col pb-20">
            <Toaster />
            <Navbar />
            <div className="container mx-auto p-4 mt-10 md:mt-20">
                <h1 className="text-4xl font-bold mb-8 text-center">Your Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center gap-5">
                        <p className="text-center text-lg">Your cart is empty. 😥</p>
                        <Link to="/explore"><button className="btn btn-soft btn-primary rounded-2xl">Add products now</button></Link>
                    </div>
                ) : (
                    <div className="flex flex-col items-center lg:flex-row gap-8 ">
                        <div className="lg:w-2/3 bg-base-100 p-6 rounded-3xl shadow-xl">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border-b border-base-200 last:border-b-0">
                                    <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                                    <div className="flex-grow">
                                        <h2 className="text-xl font-semibold">{item.name}</h2>
                                        <p className="text-lg font-bold">
                                            {item.price} Kč
                                            <span className="text-sm font-normal text-gray-500 ml-2">
                                                ({item.quantity}x)
                                            </span>
                                        </p>
                                    </div>
                                    <div className='flex sm:flex-row items-center gap-0 sm:gap-10'>
                                        <div className="flex items-center gap-1 border border-primary rounded-2xl overflow-hidden min-w-[90px]">
                                            <button
                                                className="btn h-10 btn-ghost transition-all duration-300 rounded-none btn-primary btn-sm px-2 flex-shrink-0"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                                                onBlur={(e) => {
                                                    const val = parseInt(e.target.value, 10);
                                                    if (isNaN(val) || val < 1) updateQuantity(item.id, 1);
                                                }}
                                                className="input input-ghost w-10 max-w-[40px] focus:outline-none input-primary input-sm text-center px-0 bg-transparent"
                                                min="1"
                                            />
                                            <button
                                                className="btn h-10 btn-ghost transition-all duration-300 rounded-none btn-primary btn-sm px-2 flex-shrink-0"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            className="btn btn-ghost btn-circle text-error hover:bg-error/20 hover:text-error"
                                            onClick={() => {
                                                removeFromCart(item.id);
                                                handleRemove();
                                            }}
                                        >
                                            <FaTrash size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:w-1/3  bg-base-100 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

                                <div className="mb-4">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex flex-col sm:flex-row sm:justify-between text-base mb-2">
                                            <div className="flex-grow">
                                                <span className="font-medium">
                                                    {item.name}
                                                </span>
                                                <span className="sm:hidden block pr-2 text-gray-500">
                                                    {item.quantity}x{item.price} Kč
                                                </span>
                                            </div>
                                            <div className="flex justify-between sm:justify-end gap-2 items-baseline">
                                                <span className="hidden sm:inline pr-2 text-gray-500">
                                                    {item.quantity}x{item.price} Kč
                                                </span>
                                                <span className="font-semibold">
                                                    {item.quantity * item.price} Kč
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between text-lg font-semibold border-t pt-4 mt-4 border-base-200">
                                    <span>Total:</span>
                                    <span>{getTotalPrice()} Kč</span>
                                </div>
                            </div>
                            <button className="btn rounded-2xl btn-primary w-full mt-6">Proceed to Checkout</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}