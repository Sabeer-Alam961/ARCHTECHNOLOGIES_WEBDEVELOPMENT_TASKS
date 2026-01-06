import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaUserPlus, FaBell, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data } = await api.get('/notifications');
                setNotifications(data);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const handleAccept = async (id, requestId) => {
        try {
            await api.put(`/users/friend-request/${requestId}/accept`);
            toast.success('Friend request accepted!');
            markAsRead(id);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to accept request');
        }
    };

    const handleReject = async (id, requestId) => {
        try {
            await api.put(`/users/friend-request/${requestId}/reject`);
            toast.success('Friend request rejected');
            markAsRead(id);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reject request');
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                        <FaHeart size={16} />
                    </div>
                );
            case 'comment':
                return (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                        <FaComment size={16} />
                    </div>
                );
            case 'friend_request':
                return (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                        <FaUserPlus size={16} />
                    </div>
                );
            default:
                return (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white">
                        <FaBell size={16} />
                    </div>
                );
        }
    };

    const getNotificationMessage = (notification) => {
        switch (notification.type) {
            case 'like':
                return <span><strong className="theme-text-primary">{notification.from?.username}</strong> liked your post</span>;
            case 'comment':
                return <span><strong className="theme-text-primary">{notification.from?.username}</strong> commented on your post</span>;
            case 'friend_request':
                return <span><strong className="theme-text-primary">{notification.from?.username}</strong> sent you a friend request</span>;
            default:
                return <span>You have a new notification</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="theme-text-muted font-medium">Loading notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold theme-text-primary">Notifications</h1>
                        <p className="theme-text-muted mt-1">Stay updated with your activity</p>
                    </div>
                    {notifications.length > 0 && (
                        <button className="text-primary-600 font-semibold text-sm hover:underline">
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* Notifications List */}
                {notifications.length > 0 ? (
                    <div className="space-y-3">
                        {notifications.map((notification, index) => (
                            <div
                                key={notification._id}
                                className={`glass-card rounded-2xl p-5 flex items-center gap-4 hover-lift fade-in cursor-pointer transition-all ${!notification.isRead ? 'ring-2 ring-primary-500/20 theme-bg-inner' : ''
                                    }`}
                                style={{ animationDelay: `${index * 0.05}s` }}
                                onClick={() => !notification.isRead && markAsRead(notification._id)}
                            >
                                {/* Icon */}
                                {getNotificationIcon(notification.type)}

                                {/* Content */}
                                <div className="flex-grow min-w-0">
                                    <p className="theme-text-secondary text-sm">
                                        {getNotificationMessage(notification)}
                                    </p>
                                    <p className="theme-text-muted text-xs mt-1">
                                        {new Date(notification.createdAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                {/* Actions for friend requests */}
                                {notification.type === 'friend_request' && !notification.isRead && (
                                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => handleAccept(notification._id, notification.relatedUser?._id || notification.relatedUser)}
                                            className="w-9 h-9 rounded-xl bg-primary-500 text-white hover:bg-primary-600 flex items-center justify-center transition-colors"
                                            title="Accept"
                                        >
                                            <FaCheck size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleReject(notification._id, notification.relatedUser?._id || notification.relatedUser)}
                                            className="w-9 h-9 rounded-xl theme-bg-inner theme-text-muted hover:theme-text-primary flex items-center justify-center transition-colors"
                                            title="Reject"
                                        >
                                            <FaTimes size={14} />
                                        </button>
                                    </div>
                                )}

                                {/* Unread indicator */}
                                {!notification.isRead && (
                                    <div className="w-3 h-3 rounded-full bg-primary-500 flex-shrink-0"></div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card rounded-2xl p-12 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaBell className="text-4xl text-primary-400" />
                        </div>
                        <h3 className="text-xl font-bold theme-text-primary mb-2">All caught up!</h3>
                        <p className="theme-text-muted max-w-sm mx-auto">
                            You don't have any notifications right now. We'll let you know when something happens.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
