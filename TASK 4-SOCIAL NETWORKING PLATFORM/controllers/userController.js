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
            // Determine relationship status with the requesting user
            let relationship = 'none';
            const currentUserId = req.user.id;

            if (user._id.toString() === currentUserId) {
                relationship = 'self';
            } else if (user.friends.some(f => f._id.toString() === currentUserId)) {
                relationship = 'friends';
            } else {
                const pendingSent = await FriendRequest.findOne({
                    sender: currentUserId,
                    receiver: user._id,
                    status: 'pending'
                });
                if (pendingSent) {
                    relationship = 'pending_sent';
                } else {
                    const pendingReceived = await FriendRequest.findOne({
                        sender: user._id,
                        receiver: currentUserId,
                        status: 'pending'
                    });
                    if (pendingReceived) {
                        relationship = 'pending_received';
                    }
                }
            }

            res.json({ ...user._doc, relationship });
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

            if (req.file) {
                user.profile.avatar = req.file.path;
            } else if (req.body.avatar) {
                user.profile.avatar = req.body.avatar;
            }

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
        let friendRequest = await FriendRequest.findById(requestId);

        // If not found by ID, it might be a sender ID (passed from notification)
        if (!friendRequest) {
            friendRequest = await FriendRequest.findOne({
                sender: requestId,
                receiver: req.user.id,
                status: 'pending'
            });
        }

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

        if (!sender.friends.includes(receiver.id)) {
            sender.friends.push(receiver.id);
        }
        if (!receiver.friends.includes(sender.id)) {
            receiver.friends.push(sender.id);
        }

        await sender.save();
        await receiver.save();

        // Create notification for the sender that their request was accepted
        await createNotification(friendRequest.sender, 'friend_accept', req.user.id);

        res.json({ message: 'Friend request accepted' });

    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
}

// @desc    Reject Friend Request
// @route   PUT /api/users/friend-request/:requestId/reject
// @access  Protected
const rejectFriendRequest = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        let friendRequest = await FriendRequest.findById(requestId);

        // If not found by ID, it might be a sender ID
        if (!friendRequest) {
            friendRequest = await FriendRequest.findOne({
                sender: requestId,
                receiver: req.user.id,
                status: 'pending'
            });
        }

        if (!friendRequest) {
            res.status(404);
            throw new Error('Friend request not found');
        }

        if (friendRequest.receiver.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized to reject this request');
        }

        friendRequest.status = 'rejected';
        await friendRequest.save();

        res.json({ message: 'Friend request rejected' });

    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

// @desc    Get Pending Friend Requests
// @route   GET /api/users/friend-requests
// @access  Protected
const getFriendRequests = async (req, res) => {
    try {
        const requests = await FriendRequest.find({
            receiver: req.user.id,
            status: 'pending'
        }).populate('sender', 'username profile.avatar');

        res.json(requests);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

// @desc    Remove Friend (Unfriend)
// @route   DELETE /api/users/friends/:id
// @access  Protected
const removeFriend = async (req, res) => {
    try {
        const friendId = req.params.id;
        const userId = req.user.id;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!friend) {
            res.status(404);
            throw new Error('User not found');
        }

        user.friends = user.friends.filter(f => f.toString() !== friendId);
        friend.friends = friend.friends.filter(f => f.toString() !== userId);

        await user.save();
        await friend.save();

        // Also remove any accepted friend request record to allow re-friending later if desired
        await FriendRequest.findOneAndDelete({
            $or: [
                { sender: userId, receiver: friendId },
                { sender: friendId, receiver: userId }
            ]
        });

        res.json({ message: 'Friend removed' });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequests,
    removeFriend,
};
