import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUserPlus, FaEnvelope, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaCamera, FaCheck, FaUserCheck } from 'react-icons/fa';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [updatingAvatar, setUpdatingAvatar] = useState(false);

    const avatarOptions = [
        '/avatars/avatar_male_1.png',
        '/avatars/avatar_female_1.png',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Missy',
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get(`/users/${id}`);
                setProfileUser(data);
            } catch (error) {
                toast.error('Failed to load profile');
                console.error(error);
            }
            setLoading(false);
        };
        fetchProfile();
    }, [id]);

    const handleFriendRequest = async () => {
        try {
            await api.post(`/users/friend-request/${id}`);
            toast.success('Friend Request Sent!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send request');
        }
    };

    const handleAvatarUpdate = async (newAvatar) => {
        setUpdatingAvatar(true);
        try {
            const { data } = await api.put('/users/profile', { avatar: newAvatar });
            setProfileUser(prev => ({ ...prev, profile: data.profile }));
            setShowAvatarModal(false);
            toast.success('Avatar updated successfully!');
            // Update local storage/context if needed
        } catch (error) {
            toast.error('Failed to update avatar');
            console.error(error);
        }
        setUpdatingAvatar(false);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Loading profile...</p>
            </div>
        </div>
    );

    if (!profileUser) return (
        <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">😕</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">User not found</h2>
            <p className="text-gray-500">This user doesn't exist or has been removed.</p>
            <Link to="/" className="inline-block mt-4 text-primary-600 font-semibold hover:underline">Go back home</Link>
        </div>
    );

    const isOwnProfile = currentUser && (currentUser.id === profileUser._id || currentUser._id === profileUser._id);

    return (
        <div className="min-h-screen pb-12">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Avatar Selection Modal */}
                {showAvatarModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in">
                        <div className="glass-card max-w-md w-full rounded-3xl p-8 scale-in shadow-2xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Avatar</h2>
                            <p className="text-gray-500 mb-6 text-sm">Select a fresh look for your profile profile.</p>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {avatarOptions.map((avatar, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAvatarUpdate(avatar)}
                                        disabled={updatingAvatar}
                                        className={`relative group rounded-full overflow-hidden ring-2 ring-transparent hover:ring-primary-500 transition-all transform hover:scale-105 ${updatingAvatar ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <img src={avatar} alt={`Avatar option ${index}`} className="w-full aspect-square object-cover" />
                                        <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/10 transition-colors" />
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowAvatarModal(false)}
                                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Header Card */}
                <div className="glass-card rounded-3xl overflow-hidden mb-6 fade-in">
                    {/* Cover Image */}
                    <div className="h-48 md:h-72 bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-10 left-10 w-32 h-32 border border-white/40 rounded-full"></div>
                            <div className="absolute bottom-10 right-20 w-48 h-48 border border-white/30 rounded-full"></div>
                            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
                        </div>

                        {isOwnProfile && (
                            <button className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/30 transition-all font-medium text-sm">
                                <FaCamera />
                                <span>Edit Cover</span>
                            </button>
                        )}
                    </div>

                    <div className="px-6 pb-8 relative">
                        <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20 mb-6 gap-6">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="p-1 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full">
                                    <img
                                        src={profileUser.profile?.avatar || 'https://via.placeholder.com/160'}
                                        alt="Avatar"
                                        className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white object-cover bg-white shadow-lg"
                                    />
                                </div>
                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-3 border-white rounded-full"></div>
                                {isOwnProfile && (
                                    <button
                                        onClick={() => setShowAvatarModal(true)}
                                        className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white backdrop-blur-sm"
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <FaCamera size={24} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                                        </div>
                                    </button>
                                )}
                            </div>

                            {/* Info & Actions */}
                            <div className="flex-grow text-center md:text-left mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{profileUser.username}</h1>
                                <p className="text-gray-500 font-medium">@{profileUser.username}</p>
                                <div className="flex items-center justify-center md:justify-start gap-6 mt-3 text-sm text-gray-500">
                                    <span><strong className="text-gray-900">256</strong> Friends</span>
                                    <span><strong className="text-gray-900">48</strong> Posts</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 w-full md:w-auto justify-center md:justify-end">
                                {!isOwnProfile && (
                                    <>
                                        <button
                                            onClick={handleFriendRequest}
                                            className="btn-gradient text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                                        >
                                            <FaUserPlus />
                                            <span>Add Friend</span>
                                        </button>
                                        <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2">
                                            <FaEnvelope />
                                            <span>Message</span>
                                        </button>
                                    </>
                                )}
                                {isOwnProfile && (
                                    <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - About */}
                    <div className="space-y-6">
                        {/* About Card */}
                        <div className="glass-card rounded-2xl p-6 hover-lift">
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">About</h3>
                            <p className="text-gray-600 leading-relaxed text-sm mb-6">
                                {profileUser.profile?.bio || 'Just another amazing person on SocialNet. 🌟'}
                            </p>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                                        <FaBriefcase />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Works at</p>
                                        <p className="font-semibold text-gray-900">Tech Corporation</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Lives in</p>
                                        <p className="font-semibold text-gray-900">New York, USA</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                        <FaCalendarAlt />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Joined</p>
                                        <p className="font-semibold text-gray-900">
                                            {new Date(profileUser.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Friends Preview Card */}
                        <div className="glass-card rounded-2xl p-6 hover-lift">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900 text-lg">Friends</h3>
                                <a href="#" className="text-primary-600 text-sm font-medium hover:underline">See All</a>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="text-center group cursor-pointer">
                                        <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-lg mb-2 group-hover:scale-105 transition-transform">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                        <p className="text-xs text-gray-600 font-medium truncate">Friend {i}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Posts */}
                    <div className="lg:col-span-2">
                        <div className="glass-card rounded-2xl p-8 text-center hover-lift">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">📭</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                When {profileUser.username} shares posts, they will appear here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
