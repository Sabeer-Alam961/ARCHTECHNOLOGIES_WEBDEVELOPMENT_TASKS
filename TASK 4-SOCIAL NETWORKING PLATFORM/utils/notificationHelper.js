const Notification = require('../database/models/Notification');
const { getIO } = require('../socket/socket');

const createNotification = async (recipientId, type, relatedUserId, relatedPostId = null) => {
    try {
        if (recipientId.toString() === relatedUserId.toString()) return; // Don't notify self

        const notification = await Notification.create({
            recipient: recipientId,
            type,
            relatedUser: relatedUserId,
            relatedPost: relatedPostId,
        });

        // Emit real-time event
        try {
            const io = getIO();
            io.to('user_' + recipientId).emit('new_notification', {
                type,
                relatedUserId,
                relatedPostId,
                message: `New ${type} notification`,
            });
        } catch (socketError) {
            console.error('Socket Emit Error:', socketError.message);
        }

    } catch (error) {
        console.error('Notification Error:', error.message);
    }
};

module.exports = createNotification;
