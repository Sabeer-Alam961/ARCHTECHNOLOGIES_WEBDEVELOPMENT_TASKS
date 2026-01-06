import { useState, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaImage, FaUserTag, FaSmile, FaPaperPlane } from 'react-icons/fa';

const CreatePost = ({ onPostCreated }) => {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { user } = useContext(AuthContext);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('content', text);
            if (image) {
                formData.append('image', image);
            }

            const { data } = await api.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setText('');
            setImage(null);
            setImagePreview(null);
            toast.success('Post Created!');
            if (onPostCreated) onPostCreated(data);
        } catch (error) {
            toast.error('Failed to create post');
        } finally {
            setIsUploading(false);
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
                            className="w-full theme-bg-inner rounded-2xl p-4 theme-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all resize-none min-h-[100px] border theme-border"
                            placeholder={`What's happening, ${user?.username}?`}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            required={!image}
                        />
                    </div>

                    {imagePreview && (
                        <div className="mt-4 relative rounded-2xl overflow-hidden border border-gray-100 group">
                            <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-[400px] object-cover" />
                            <button
                                type="button"
                                onClick={() => { setImage(null); setImagePreview(null); }}
                                className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all backdrop-blur-sm"
                            >
                                <FaPaperPlane className="rotate-45" /> {/* Using an icon to close, ideally FaTimes */}
                                <span className="sr-only">Remove image</span>
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100/50">
                        <div className="flex gap-1">
                            <input
                                type="file"
                                id="post-image"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('post-image').click()}
                                className="flex items-center gap-2 theme-text-muted hover:text-green-500 hover:bg-green-500/10 px-3 py-2 rounded-xl transition-all text-sm font-medium icon-btn"
                            >
                                <FaImage className="text-lg" />
                                <span className="hidden sm:inline">Photo</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center gap-2 theme-text-muted hover:text-blue-500 hover:bg-blue-500/10 px-3 py-2 rounded-xl transition-all text-sm font-medium icon-btn"
                            >
                                <FaUserTag className="text-lg" />
                                <span className="hidden sm:inline">Tag</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center gap-2 theme-text-muted hover:text-yellow-500 hover:bg-yellow-500/10 px-3 py-2 rounded-xl transition-all text-sm font-medium icon-btn"
                            >
                                <FaSmile className="text-lg" />
                                <span className="hidden sm:inline">Feeling</span>
                            </button>
                        </div>

                        <button
                            type="submit"
                            className={`btn-gradient text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none`}
                            disabled={(!text.trim() && !image) || isUploading}
                        >
                            {isUploading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <FaPaperPlane className="text-sm" />
                            )}
                            <span>{isUploading ? 'Posting...' : 'Post'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
