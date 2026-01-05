import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get('/auth/me');
                    setUser(data);
                } catch (error) {
                    console.error(error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    // Login
    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            setUser(data);
            toast.success('Login Successful');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login Failed');
            return false;
        }
    };

    // Register
    const register = async (username, email, password, avatar) => {
        try {
            const { data } = await api.post('/auth/register', { username, email, password, avatar });
            localStorage.setItem('token', data.token);
            setUser(data);
            toast.success('Registration Successful');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration Failed');
            return false;
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.info('Logged out');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
