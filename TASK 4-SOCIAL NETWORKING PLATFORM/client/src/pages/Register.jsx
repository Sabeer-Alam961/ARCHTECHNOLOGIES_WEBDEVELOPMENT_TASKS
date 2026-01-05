import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaFacebook, FaGoogle, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Avatar Selection State
    const avatarOptions = [
        '/avatars/avatar_male_1.png',
        '/avatars/avatar_female_1.png',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Missy',
    ];
    const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        const success = await register(username, email, password, selectedAvatar);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-4xl w-full glass-card rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row fade-in">

                {/* Left Side: Form */}
                <div className="md:w-1/2 p-10 bg-white/50 order-2 md:order-1">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Join <span className="text-gradient">SocialNet</span></h2>
                        <p className="text-gray-500 text-sm mt-2">Create your account to get started.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-700 block text-center">Choose Your Avatar</label>
                            <div className="flex flex-wrap justify-center gap-4">
                                {avatarOptions.map((avatar, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setSelectedAvatar(avatar)}
                                        className={`relative group transition-all transform hover:scale-110 active:scale-95 ${selectedAvatar === avatar ? 'ring-4 ring-primary-500 ring-offset-2' : 'ring-1 ring-gray-200'
                                            } rounded-full p-0.5 overflow-hidden shadow-sm`}
                                    >
                                        <img src={avatar} alt={`Avatar ${index}`} className="w-12 h-12 rounded-full object-cover bg-white" />
                                        {selectedAvatar === avatar && (
                                            <div className="absolute inset-0 bg-primary-500/10 flex items-center justify-center">
                                                <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center text-white text-[10px] shadow-sm">✓</div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <FaUser className="absolute top-4 left-4 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/80 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 focus:bg-white transition-all text-sm"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
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
                        <div className="relative">
                            <FaLock className="absolute top-4 left-4 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/80 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 focus:bg-white transition-all text-sm"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-gradient text-white py-3.5 rounded-xl font-bold text-lg mt-6"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-6 border-t border-gray-200/50 pt-6">
                        <p className="text-center text-gray-500 text-sm mb-4">Or sign up with</p>
                        <div className="flex gap-4 justify-center">
                            <button className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-gray-200/80 text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all hover-lift">
                                <FaFacebook size={22} />
                            </button>
                            <button className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-gray-200/80 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all hover-lift">
                                <FaGoogle size={22} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500">Already have an account? </span>
                        <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 hover:underline transition-colors">Sign In</Link>
                    </div>
                </div>

                {/* Right Side: Illustration */}
                <div className="md:w-1/2 bg-gradient-to-br from-secondary-500 via-primary-500 to-primary-600 p-10 text-white flex flex-col justify-center items-center text-center relative overflow-hidden order-1 md:order-2">
                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-20 right-10 w-32 h-32 border border-white/30 rounded-full"></div>
                        <div className="absolute bottom-10 left-10 w-48 h-48 border border-white/20 rounded-full"></div>
                        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                    </div>

                    <div className="relative z-10 w-full flex flex-col items-center">
                        <h1 className="text-3xl font-bold mb-4">Start Your Journey</h1>
                        <p className="text-primary-100 mb-8 max-w-xs mx-auto leading-relaxed text-sm">
                            Join millions of people sharing their stories and connecting with others.
                        </p>
                        <div className="mb-6 avatar-ring p-1 bg-white/20 rounded-full inline-block scale-110">
                            <img src={selectedAvatar} alt="Selected Avatar" className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white shadow-xl object-cover bg-white" />
                        </div>
                        <div className="float text-6xl mt-4">🚀</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
