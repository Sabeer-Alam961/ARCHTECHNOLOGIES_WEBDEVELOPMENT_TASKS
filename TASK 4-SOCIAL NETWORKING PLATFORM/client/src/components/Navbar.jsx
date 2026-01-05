import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { FaHome, FaUser, FaSignOutAlt, FaBell, FaSearch } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="fixed top-0 w-full z-50 glass-card border-b-0">
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-400/50 to-transparent"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all group-hover:scale-105">
                        S
                    </div>
                    <span className="text-2xl font-bold text-gradient tracking-tight">SocialNet</span>
                </Link>

                {/* Search Bar - Desktop */}
                {user && (
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search friends, posts..."
                                className="w-full pl-11 pr-4 py-2.5 bg-gray-50/80 rounded-full border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 focus:bg-white transition-all text-sm"
                            />
                        </div>
                    </div>
                )}

                {/* Desktop Menu */}
                {user ? (
                    <div className="flex items-center gap-2">
                        <Link
                            to="/"
                            className="p-3 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all relative group icon-btn"
                        >
                            <FaHome className="text-xl" />
                            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">Home</span>
                        </Link>

                        <Link
                            to="/notifications"
                            className="p-3 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all relative group icon-btn"
                        >
                            <FaBell className="text-xl" />
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white pulse-dot"></span>
                            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">Notifications</span>
                        </Link>

                        <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent mx-2"></div>

                        <Link
                            to={`/profile/${user.id || user._id}`}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all group"
                        >
                            <div className="avatar-ring">
                                <img
                                    src={user.profile?.avatar || 'https://via.placeholder.com/40'}
                                    alt="Profile"
                                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white"
                                />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 hidden sm:block group-hover:text-primary-600 transition-colors">{user.username}</span>
                        </Link>

                        <button
                            onClick={logout}
                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all icon-btn"
                            title="Logout"
                        >
                            <FaSignOutAlt className="text-lg" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-gray-600 hover:text-primary-600 font-semibold text-sm transition-colors px-4 py-2 hover:bg-primary-50 rounded-lg"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            className="btn-gradient text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg"
                        >
                            Sign up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
