import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaFacebook, FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-4xl w-full glass-card rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row fade-in">

                {/* Left Side: Illustration */}
                <div className="md:w-1/2 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 p-10 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-10 left-10 w-32 h-32 border border-white/30 rounded-full"></div>
                        <div className="absolute bottom-20 right-10 w-48 h-48 border border-white/20 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                    </div>

                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                        <p className="text-primary-100 mb-8 max-w-xs mx-auto leading-relaxed">
                            Connect with friends, share your moments, and stay up to date with the world.
                        </p>
                        <div className="w-48 h-48 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto float">
                            <span className="text-8xl">👋</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-1/2 p-10 bg-white/50">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Sign In to <span className="text-gradient">SocialNet</span></h2>
                        <p className="text-gray-500 text-sm mt-2">Please enter your details to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <FaEnvelope className="absolute top-4 left-4 text-gray-400" />
                            <input
                                type="email"
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/80 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 focus:bg-white transition-all text-sm"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute top-4 left-4 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="w-full pl-12 pr-12 py-3.5 bg-gray-50/80 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 focus:bg-white transition-all text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <a href="#" className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-gradient text-white py-3.5 rounded-xl font-bold text-lg"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 border-t border-gray-200/50 pt-6">
                        <p className="text-center text-gray-500 text-sm mb-4">Or continue with</p>
                        <div className="flex gap-4 justify-center">
                            <button className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-gray-200/80 text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all hover-lift">
                                <FaFacebook size={22} />
                            </button>
                            <button className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-gray-200/80 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all hover-lift">
                                <FaGoogle size={22} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-gray-500">Don't have an account? </span>
                        <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 hover:underline transition-colors">Register Now</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
