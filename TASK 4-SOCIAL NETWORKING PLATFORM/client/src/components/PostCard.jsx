import { useState, useContext } from 'react';
import { FaHeart, FaComment, FaShare, FaPaperPlane, FaRegHeart, FaBookmark, FaEllipsisH } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const PostCard = ({ post }) => {
    const { user } = useContext(AuthContext);
    const [likes, setLikes] = useState(post.likes);
    const [liked, setLiked] = useState(post.likes.includes(user?._id || user?.id));

    // Comment State
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);

    const handleLike = async () => {
        try {
            const { data } = await api.put(`/posts/${post._id}/like`);
            setLikes(data);
            setLiked(data.includes(user?._id || user?.id));
        } catch (error) {
            console.error(error);
        }
    };

    const toggleComments = async () => {
        if (!showComments) {
            setLoadingComments(true);
            try {
                const { data } = await api.get(`/comments/${post._id}`);
                setComments(data);
            } catch (error) {
                console.error(error);
            }
            setLoadingComments(false);
        }
        setShowComments(!showComments);
    };

    const submitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const { data } = await api.post(`/comments/${post._id}`, { content: newComment });
            setComments([...comments, data]);
            setNewComment('');
            toast.success('Comment added');
        } catch (error) {
            toast.error('Failed to add comment');
        }
    };

    return (
        <div className="glass-card rounded-2xl overflow-hidden hover-lift card-shine fade-in">
            {/* Header */}
            <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${post.author._id}`} className="avatar-ring flex-shrink-0">
                        <img
                            src={post.author.profile?.avatar || 'https://via.placeholder.com/44'}
                            alt="Avatar"
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-white"
                        />
                    </Link>
                    <div>
                        <Link
                            to={`/profile/${post.author._id}`}
                            className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                        >
                            {post.author.username}
                        </Link>
                        <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                <button className="text-gray-400 hover:text-gray-600 p-2.5 rounded-xl hover:bg-gray-50 transition-all icon-btn">
                    <FaEllipsisH />
                </button>
            </div>

            {/* Content */}
            <div className="px-5 pb-3">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-[15px]">{post.content.text}</p>
            </div>

            {post.content.image && (
                <div className="mt-2">
                    <img src={post.content.image} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" />
                </div>
            )}

            {/* Stats */}
            <div className="px-5 py-3 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    {likes.length > 0 && (
                        <>
                            <div className="flex -space-x-1">
                                <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs shadow-sm">
                                    <FaHeart size={10} />
                                </div>
                            </div>
                            <span className="ml-1 hover:underline cursor-pointer font-medium">{likes.length} {likes.length === 1 ? 'like' : 'likes'}</span>
                        </>
                    )}
                </div>
                <div className="flex gap-4 text-gray-400">
                    <span className="hover:underline cursor-pointer hover:text-gray-600 transition-colors">{comments.length || 0} comments</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center px-3 py-2 border-t border-gray-100/50 mx-2">
                <button
                    onClick={handleLike}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all active:scale-95 font-medium ${liked
                            ? 'text-red-500 bg-red-50/80'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    {liked ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg" />}
                    <span>Like</span>
                </button>
                <button
                    onClick={toggleComments}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all active:scale-95 font-medium ${showComments
                            ? 'text-primary-600 bg-primary-50/80'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    <FaComment className="text-lg" />
                    <span>Comment</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 transition-all active:scale-95 font-medium">
                    <FaShare className="text-lg" />
                    <span>Share</span>
                </button>
                <button className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-primary-600 transition-all icon-btn">
                    <FaBookmark />
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="bg-gray-50/50 p-5 border-t border-gray-100/50 fade-in">
                    {/* Comment Form */}
                    <form onSubmit={submitComment} className="flex items-center gap-3 mb-5">
                        <img
                            src={user?.profile?.avatar || 'https://via.placeholder.com/36'}
                            alt="My Avatar"
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-white flex-shrink-0"
                        />
                        <div className="flex-grow relative">
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                className="w-full bg-white rounded-full px-5 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500/30 border border-gray-200/80 text-sm transition-all"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                            >
                                <FaPaperPlane size={14} />
                            </button>
                        </div>
                    </form>

                    {/* Comments List */}
                    {loadingComments ? (
                        <div className="flex justify-center py-6">
                            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {comments.map((comment, index) => (
                                <div key={comment._id} className="flex gap-3 fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <Link to={`/profile/${comment.author._id}`} className="flex-shrink-0">
                                        <img
                                            src={comment.author.profile?.avatar || 'https://via.placeholder.com/36'}
                                            alt="Avatar"
                                            className="w-9 h-9 rounded-full object-cover ring-2 ring-white"
                                        />
                                    </Link>
                                    <div className="flex-grow">
                                        <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100/50 inline-block max-w-full">
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <Link
                                                    to={`/profile/${comment.author._id}`}
                                                    className="font-semibold text-sm text-gray-900 hover:text-primary-600 transition-colors"
                                                >
                                                    {comment.author.username}
                                                </Link>
                                                <span className="text-gray-400 text-xs">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {comments.length === 0 && (
                                <p className="text-center text-gray-400 text-sm py-4">No comments yet. Be the first to comment!</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostCard;
