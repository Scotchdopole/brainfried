import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import { toast } from 'react-hot-toast';
import { useCart } from "../../cartContext";
import { FaShoppingCart } from 'react-icons/fa';

export default function Navbar() {
    const { isLoggedIn, isCurrentUserAdmin, logout } = useAuth();
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
                        <li><Link className='btn hover:bg-primary rounded-2xl btn-ghost' to="/game">Brainrot catcher</Link></li>
                        {isCurrentUserAdmin && (
                            <li><Link className='btn hover:bg-primary rounded-2xl btn-ghost' to="/admin">Admin Panel</Link></li>
                        )}
                        <li>
                            {isLoggedIn ? (
                                <button onClick={handleLogout} className="btn hover:bg-primary rounded-2xl btn-ghost">Logout</button>
                            ) : (
                                <Link to="/login" className="btn hover:bg-primary rounded-2xl btn-ghost">Login</Link>
                            )}
                        </li>
                    </ul>
                </div>
                <div className='hidden md:flex gap-5'>
                    <Link to="/explore" className="btn hover:bg-primary rounded-2xl btn-ghost">Explore</Link>
                    <Link to="/test" className="btn hover:bg-primary rounded-2xl btn-ghost">Brainrot test</Link>
                    <Link to="/game" className="btn hover:bg-primary rounded-2xl btn-ghost">Brainrot catcher</Link>

                </div>
            </div>
            <div className="navbar-center">
                <Link to="/" className="btn border-0 bg-transparent shadow-none text-xl">Brainfried</Link>
            </div>
            <div className="navbar-end">
                {isCurrentUserAdmin && (
                    <Link to="/admin" className="btn hover:bg-primary rounded-2xl btn-ghost">Admin Panel</Link>
                )}
                <div tabIndex={0} className='hidden md:flex'>
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="btn hover:bg-primary rounded-2xl btn-ghost">Logout</button>
                    ) : (
                        <Link to="/login" className="btn hover:bg-primary rounded-2xl btn-ghost">Login</Link>
                    )}
                </div>
                <Link to="/cart" className="btn btn-ghost btn-circle hover:btn-primary">
                    <div className="indicator">
                        <FaShoppingCart size={16} />
                        {getTotalItems() > 0 && (
                            <span className="badge badge-sm badge-primary indicator-item">{getTotalItems()}</span>
                        )}
                    </div>
                </Link>
            </div>
        </div >
    );
}