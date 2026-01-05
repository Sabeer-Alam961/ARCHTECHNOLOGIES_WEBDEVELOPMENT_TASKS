const User = require('../database/models/User');
const FriendRequest = require('../database/models/FriendRequest');
const createNotification = require('../utils/notificationHelper');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Protected
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('friends', 'username profile.avatar');

        if (user) {
            res.json(user);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Protected
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.profile.firstName = req.body.firstName || user.profile.firstName;
            user.profile.lastName = req.body.lastName || user.profile.lastName;
            user.profile.bio = req.body.bio || user.profile.bio;
            user.profile.avatar = req.body.avatar || user.profile.avatar;

            // Password update logic could go here too

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                profile: updatedUser.profile,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

// @desc    Send Friend Request
// @route   POST /api/users/friend-request/:id
// @access  Protected
const sendFriendRequest = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.user.id;

        if (receiverId === senderId) {
            res.status(400);
            throw new Error('Cannot send friend request to yourself');
        }

        // Check if request already exists
        const existingRequest = await FriendRequest.findOne({
            sender: senderId,
            receiver: receiverId,
        });

        if (existingRequest) {
            res.status(400);
            throw new Error('Friend request already sent');
        }

        // Check if already friends
        const user = await User.findById(senderId);
        if (user.friends.includes(receiverId)) {
            res.status(400);
            throw new Error('Already friends');
        }

        const friendRequest = await FriendRequest.create({
            sender: senderId,
            receiver: receiverId,
        });

        // Create Notification
        await createNotification(receiverId, 'friend_request', senderId);

        res.status(201).json(friendRequest);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

// @desc    Accept Friend Request
// @route   PUT /api/users/friend-request/:requestId/accept
// @access  Protected
const acceptFriendRequest = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            res.status(404);
            throw new Error('Friend request not found');
        }

        if (friendRequest.receiver.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized to accept this request');
        }

        if (friendRequest.status !== 'pending') {
            res.status(400);
            throw new Error('Request already processed');
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        // Add to friends list for both users
        const sender = await User.findById(friendRequest.sender);
        const receiver = await User.findById(friendRequest.receiver);

        sender.friends.push(receiver.id);
        receiver.friends.push(sender.id);

        await sender.save();
        await receiver.save();

        res.json({ message: 'Friend request accepted' });

    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
}

module.exports = {
    getUserProfile,
    updateUserProfile,
    sendFriendRequest,
    acceptFriendRequest,
};
