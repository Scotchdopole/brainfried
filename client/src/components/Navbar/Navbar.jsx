import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import { toast } from 'react-hot-toast';
import { useCart } from "../../cartContext"
import { FaShoppingCart } from 'react-icons/fa'; // Import ikony košíku

export default function Navbar() {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully!", {
                style: {
                    borderRadius: '10px',
                    background: '#191e24',
                    color: '#fff',
                },
                position: "top-center",
                duration: 3000
            });
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed. Please try again.", {
                style: {
                    borderRadius: '10px',
                    background: '#191e24',
                    color: '#fff',
                },
                position: "top-center",
                duration: 3000
            });
        }
    };

    const { getTotalItems } = useCart();

    return (
        <div className="navbar bg-base-100 shadow-sm max-w-7xl mx-auto rounded-3xl relative top-5">
            <div className="navbar-start">
                <div className="dropdown md:hidden">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-screen p-2 shadow">
                        <li><Link className='btn hover:bg-primary rounded-2xl btn-ghost' to="/explore">Explore</Link></li>
                        <li><Link className='btn hover:bg-primary rounded-2xl btn-ghost' to="/test">Brainrot test</Link></li>
                        <li>
                            {isLoggedIn ? (
                                <Link onClick={handleLogout} className="btn hover:bg-primary rounded-2xl btn-ghost">Logout</Link>
                            ) : (
                                <Link to="/login" className="btn hover:bg-primary rounded-2xl btn-ghost">Login</Link>
                            )}
                        </li>
                    </ul>
                </div>
                <div className='hidden md:flex gap-5'>
                    <Link to="/explore" className="btn hover:bg-primary rounded-2xl btn-ghost">Explore</Link>
                    <Link to="/test" className="btn hover:bg-primary rounded-2xl btn-ghost">Brainrot test</Link>
                </div>
            </div>
            <div className="navbar-center">
                <Link to="/" className="btn border-0 bg-transparent shadow-none text-xl">Brainfried</Link>
            </div>
            <div className="navbar-end">
                <div tabIndex={0} className='hidden md:flex'>
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="btn hover:bg-primary rounded-2xl btn-ghost">Logout</button>
                    ) : (
                        <Link to="/login" className="btn hover:bg-primary rounded-2xl btn-ghost">Login</Link>
                    )}
                </div>
                <Link to="/cart" className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <FaShoppingCart size={16} />
                        {getTotalItems() > 0 && (
                            <span className="badge badge-sm badge-primary indicator-item">{getTotalItems()}</span>
                        )}
                    </div>
                </Link>
                <button className="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg>
                </button>
                <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg>
                        <span className="badge badge-xs badge-primary indicator-item"></span>
                    </div>
                </button>
            </div>
        </div >
    );
}