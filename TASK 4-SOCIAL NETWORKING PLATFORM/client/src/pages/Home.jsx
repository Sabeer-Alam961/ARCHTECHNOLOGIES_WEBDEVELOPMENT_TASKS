import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import AuthContext from '../context/AuthContext';
import { FaFire, FaUserFriends, FaBirthdayCake, FaHashtag, FaPlus } from 'react-icons/fa';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const fetchPosts = async () => {
        try {
            const { data } = await api.get('/posts');
            setPosts(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleNewPost = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Sidebar */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-20 space-y-4">
                            {/* Profile Quick Card */}
                            <div className="glass-card rounded-2xl p-5 hover-lift">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="avatar-ring">
                                        <img
                                            src={user?.profile?.avatar || 'https://via.placeholder.com/48'}
                                            alt="Profile"
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{user?.username}</h3>
                                        <p className="text-gray-500 text-sm">@{user?.username}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-gradient">128</p>
                                        <p className="text-gray-500 text-xs">Friends</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-gradient">{posts.length}</p>
                                        <p className="text-gray-500 text-xs">Posts</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Menu */}
                            <div className="glass-card rounded-2xl p-4">
                                <h3 className="font-semibold text-gray-900 mb-3 px-2">Quick Menu</h3>
                                <nav className="space-y-1">
                                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-all">
                                        <FaFire className="text-orange-500" />
                                        <span className="font-medium text-sm">Trending</span>
                                    </a>
                                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-all">
                                        <FaUserFriends className="text-blue-500" />
                                        <span className="font-medium text-sm">Friends</span>
                                    </a>
                                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-all">
                                        <FaHashtag className="text-purple-500" />
                                        <span className="font-medium text-sm">Explore</span>
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </aside>

                    {/* Main Feed */}
                    <main className="lg:col-span-6">
                        <CreatePost onPostCreated={handleNewPost} />

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-500 font-medium">Loading your feed...</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {posts.map((post, index) => (
                                    <div key={post._id} className="slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <PostCard post={post} />
                                    </div>
                                ))}
                                {posts.length === 0 && (
                                    <div className="glass-card rounded-2xl p-12 text-center">
                                        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-4xl">📝</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
                                        <p className="text-gray-500">Be the first to share something amazing!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>

                    {/* Right Sidebar */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-20 space-y-4">
                            {/* Suggestions Card */}
                            <div className="glass-card rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900">Suggestions</h3>
                                    <a href="#" className="text-primary-600 text-sm font-medium hover:underline">See All</a>
                                </div>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold">
                                                    {String.fromCharCode(64 + i)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">User {i}</p>
                                                    <p className="text-gray-400 text-xs">5 mutual friends</p>
                                                </div>
                                            </div>
                                            <button className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 flex items-center justify-center transition-all icon-btn">
                                                <FaPlus size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Birthdays Card */}
                            <div className="glass-card rounded-2xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-white">
                                        <FaBirthdayCake />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Birthdays</h3>
                                        <p className="text-gray-500 text-sm">Today</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    <span className="font-semibold text-gray-900">John Doe</span> and{' '}
                                    <span className="font-semibold text-gray-900">2 others</span> have birthdays today.
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="text-center text-gray-400 text-xs py-4">
                                <p>© 2024 SocialNet • All rights reserved</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Home;
