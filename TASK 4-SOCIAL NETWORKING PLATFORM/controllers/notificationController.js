const Notification = require('../database/models/Notification');

// @desc    Get my notifications
// @route   GET /api/notifications
// @access  Protected
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .populate('relatedUser', 'username profile.avatar')
            .populate('relatedPost', 'content.text')
            .sort({ createdAt: -1 });

        res.json(notifications);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Protected
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            res.status(404);
            throw new Error('Notification not found');
        }

        if (notification.recipient.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized');
        }

        notification.isRead = true;
        await notification.save();

        res.json(notification);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

module.exports = {
    getNotifications,
    markAsRead,
};
