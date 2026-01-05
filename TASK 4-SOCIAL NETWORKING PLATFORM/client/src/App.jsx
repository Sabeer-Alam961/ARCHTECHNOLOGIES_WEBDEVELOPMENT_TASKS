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
                <SocketProvider>
                    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
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
                            </Routes>
                        </div>
                        <ToastContainer />
                    </div>
                </SocketProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
