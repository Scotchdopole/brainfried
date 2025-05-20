import { Link, useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';
import { auth } from "../../userAuth";


export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const formRef = useRef(null);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        try {
            await auth.register(username, password);

            setIsLoading(false);
            navigate('/login');

        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        }
    };

    const handleButtonClick = () => {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
                handleButtonClick();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);


    return (
        <>
            <h2>Register</h2>
            <form onSubmit={handleSubmit} ref={formRef}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter your username"
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm your password"
                    />
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <p style={{ marginTop: "23px" }}>
                    Already have an account? <Link to={"/login"}>Login</Link>
                </p>
            </form>

            <button
                className='RegisterPage-SubmitButton'
                type="button"
                disabled={isLoading}
                onClick={handleButtonClick}
            >
                {isLoading ? 'Registering...' : 'Register'}
            </button>
        </>
    );
}