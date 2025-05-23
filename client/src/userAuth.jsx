// userAuth.js
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Auth services
export const auth = {
    register: (username, password) => {
        return api.post('/register', { username, password });
    },
    login: (username, password) => {
        return api.post('/login', { username, password })
            .then(response => {
                console.log('userAuth.js: Login API response received:', response.data); // Nový log
                // ZDE JE KLÍČOVÁ ZMĚNA: Přistupujeme k tokenu přes response.data.payload.token
                if (response.data.payload && response.data.payload.token) {
                    localStorage.setItem('token', response.data.payload.token);
                } else {
                    console.warn("userAuth.js: Login response did not contain response.data.payload.token.");
                }
                // DŮLEŽITÉ: Vracíme celý response.data, aby AuthContext mohl dál pracovat s message nebo případnými dalšími daty
                return response.data;
            })
            .catch(error => {
                console.error('userAuth.js: Error during login API call:', error.response ? error.response.data : error.message);
                throw error;
            });
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// User services (beze změny)
export const userService = {
    updateUser: (userData) => {
        const userId = getDecodedTokenPayload()?.id;
        if (!userId) {
            console.error("User ID not found in token for update operation.");
            return Promise.reject(new Error("User not authenticated for update."));
        }
        return api.put(`/update/${userId}`, userData);
    },
    getUserById: (userId) => {
        return api.get(`/${userId}`);
    }
};

// extract user ID and other payload from JWT token (beze změny)
const getDecodedTokenPayload = (token = localStorage.getItem('token')) => {
    console.log('userAuth.js: Attempting to decode token:', token);
    if (!token) {
        console.log('userAuth.js: No token to decode.');
        return null;
    }
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decoded = JSON.parse(jsonPayload);
        console.log('userAuth.js: Decoded token payload:', decoded);
        return decoded;
    } catch (e) {
        console.error('userAuth.js: Error decoding token:', e);
        return null;
    }
};

export default api;