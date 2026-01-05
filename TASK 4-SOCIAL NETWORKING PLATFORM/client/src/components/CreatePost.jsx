import { useState, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaImage, FaUserTag, FaSmile, FaPaperPlane } from 'react-icons/fa';

const CreatePost = ({ onPostCreated }) => {
    const [text, setText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const { user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/posts', { content: text });
            setText('');
            toast.success('Post Created!');
            if (onPostCreated) onPostCreated(data);
        } catch (error) {
            toast.error('Failed to create post');
        }
    };

    return (
        <div className={`glass-card rounded-2xl p-5 mb-6 hover-lift transition-all ${isFocused ? 'ring-2 ring-primary-500/20' : ''}`}>
            <div className="flex gap-4">
                <div className="avatar-ring flex-shrink-0">
                    <img
                        src={user?.profile?.avatar || 'https://via.placeholder.com/48'}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                    />
                </div>

                <form onSubmit={handleSubmit} className="flex-grow">
                    <div className="relative">
                        <textarea
                            className="w-full bg-gray-50/80 rounded-2xl p-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:bg-white transition-all resize-none min-h-[100px] border border-gray-100"
                            placeholder={`What's happening, ${user?.username}?`}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            required
                        />
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100/50">
                        <div className="flex gap-1">
                            <button
                                type="button"
                                className="flex items-center gap-2 text-gray-500 hover:text-green-500 hover:bg-green-50 px-3 py-2 rounded-xl transition-all text-sm font-medium icon-btn"
                            >
                                <FaImage className="text-lg" />
                                <span className="hidden sm:inline">Photo</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center gap-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 px-3 py-2 rounded-xl transition-all text-sm font-medium icon-btn"
                            >
                                <FaUserTag className="text-lg" />
                                <span className="hidden sm:inline">Tag</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center gap-2 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 px-3 py-2 rounded-xl transition-all text-sm font-medium icon-btn"
                            >
                                <FaSmile className="text-lg" />
                                <span className="hidden sm:inline">Feeling</span>
                            </button>
                        </div>

                        <button
                            type="submit"
                            className={`btn-gradient text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none`}
                            disabled={!text.trim()}
                        >
                            <FaPaperPlane className="text-sm" />
                            <span>Post</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
