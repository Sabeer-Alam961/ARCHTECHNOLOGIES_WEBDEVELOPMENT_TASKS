import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

import { ThemeProvider } from './context/ThemeContext';

// Protected Route Wrapper
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <ThemeProvider>
                    <SocketProvider>
                        <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
                            <Navbar />
                            <div className="flex-grow pt-16">
                                <Routes>
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />

                                    <Route
                                        path="/"
                                        element={
                                            <ProtectedRoute>
                                                <Home />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/profile/:id"
                                        element={
                                            <ProtectedRoute>
                                                <Profile />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/notifications"
                                        element={
                                            <ProtectedRoute>
                                                <Notifications />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/settings"
                                        element={
                                            <ProtectedRoute>
                                                <Settings />
                                            </ProtectedRoute>
                                        }
                                    />
                                </Routes>
                            </div>
                            <ToastContainer />
                        </div>
                    </SocketProvider>
                </ThemeProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
