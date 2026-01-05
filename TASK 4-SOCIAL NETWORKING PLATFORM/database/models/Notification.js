const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Notification Schema
 * Represents a notification for a user.
 */
const NotificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Indexed to find a user's notifications fast
    },
    type: {
        type: String,
        enum: ['like', 'comment', 'friend_request', 'friend_accept'],
        required: true
    },
    // The user who triggered the notification (e.g., the liker)
    relatedUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // The post related to the notification (optional, e.g., for likes/comments)
    relatedPost: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true // Helper index for filtering unread notifications
    }
}, {
    timestamps: true
});

// Index to sort by newest first
NotificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
