import Navbar from '../../components/Navbar/Navbar'
import { data, Link, useNavigate, useRouteLoaderData } from 'react-router-dom'
import React, { useRef, useState, useEffect } from 'react';
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
            const userId = getUserIdFromToken();

            if (userId) {
                navigate(`/profile/${userId}`);
            } else {
                navigate('/');
            }
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.error || 'Login failed. Please try again.');
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
        <div className='min-h-screen min-w-screen bg-base-300 flex flex-col pb-40'>
            <Navbar></Navbar>
            <div className='flex flex-col w-xl h-[500px] pt-10 items-center mx-auto mt-40 bg-base-100 shadow-2xl rounded-3xl'>
                <form className='flex flex-col items-center' onSubmit={handleSubmit} ref={formRef}>
                    <label className='font-bold text-3xl'>LOGIN</label>
                    <label className="input h-12 w-70 mt-10 focus-within:outline-transparent focus-within:border-b-4 focus-within:border- rounded-2xl">
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
                            minlength="3"
                            maxlength="30"
                            title="Only letters, numbers or dash"
                        />
                    </label>
                    <p className="validator-hint">
                        Must be 3 to 30 characters
                        <br />containing only letters, numbers or dash
                    </p>
                    <label className='input focus-within:outline-transparent focus-within:border-2 rounded-2xl'>
                        <svg class="h-[1.5em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g
                                stroke-linejoin="round"
                                stroke-linecap="round"
                                stroke-width="2.5"
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
                    <span style={{ marginTop: "23px" }}>Don't have an account? <Link to={"/register"}>Register</Link></span>
                </form>
                <button
                    className='btn btn-primary'
                    type="button"
                    disabled={isLoading}
                    onClick={handleButtonClick}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </div>
        </div>
    )
}