import Navbar from '../../components/Navbar/Navbar'
import { Link, useNavigate, useRouteLoaderData } from 'react-router-dom'
import React, { useRef, useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from "../../authContext"

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload).id;
        } catch (e) {
            console.error('Error parsing token', e);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (login) {
                await login(username, password);
            } else {
                await auth.login(username, password);
            }

            setIsLoading(false);
            toast.success("Successfully logged in", {
                style: {
                    borderRadius: '10px',
                    background: '#191e24',
                    color: '#fff',
                },
                position: "top-center",
                duration: 5000
            });
            const userId = getUserIdFromToken();

            navigate("/")
        } catch (err) {
            setIsLoading(false);
            if (err.response?.status === 401 || err.response?.data?.message === 'Invalid username or password') {
                setError('Incorrect username or password.');
            } else {
                setError(err.response?.data?.error || 'Login failed. Please try again.');
            }
        }
    };

    const handleButtonClick = () => {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                handleButtonClick();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className='min-h-screen min-w-screen bg-base-300 flex flex-col pb-20 md:pb-40'>
            <Navbar></Navbar>
            <div className='flex flex-col w-11/12 md:w-3/4 lg:w-1/2 max-w-xl h-auto items-center pb-10 mx-auto mt-20 md:mt-32 lg:mt-40 bg-base-100 shadow-2xl rounded-3xl'>
                <div className='h-10 pb-10'>
                    {isLoading && (
                        <div className='flex justify-center items-center py-4'>
                            <span className="loading loading-infinity loading-lg"></span>
                            <span className="ml-2">Loading...</span>
                        </div>
                    )}
                </div>
                <form className='flex flex-col items-center w-full px-4' onSubmit={handleSubmit} ref={formRef}>
                    <label className='font-bold text-2xl md:text-3xl'>LOGIN</label>
                    <label className="input input-primary h-12 w-full max-w-xs mt-10 focus-within:outline-transparent rounded-2xl">
                        <svg className="h-[1.5em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </g>
                        </svg>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Username"
                            pattern="[A-Za-z][A-Za-z0-9\-]*"
                            minLength="3"
                            maxLength="30"
                            title="Only letters, numbers or dash"
                        />
                    </label>
                    <label className='input input-primary bg- h-12 w-full max-w-xs mt-5 focus-within:outline-transparent focus-within:border-2 rounded-2xl'>
                        <svg className="h-[1.5em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path
                                    d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                ></path>
                                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                            </g>
                        </svg>
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    <span style={{ marginTop: "23px" }} className="text-sm md:text-base text-center px-2">Don't have an account? <Link className='link link-primary link-hover' to={"/register"}>Register</Link></span>
                </form>
                <button
                    className='btn rounded-2xl btn-primary mt-5 w-3/4 md:w-1/2'
                    type="button"
                    disabled={isLoading}
                    onClick={handleButtonClick}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <div className='h-10'>
                    {error && <p className="text-red-500 mt-2 text-center text-sm md:text-base px-2">{error}</p>}
                </div>
            </div>
        </div>
    )
}