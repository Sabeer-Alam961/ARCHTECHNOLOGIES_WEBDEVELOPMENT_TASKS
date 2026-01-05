const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * FriendRequest Schema
 * Represents a pending or processed friend request.
 */
const FriendRequestSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Indexed to find requests sent TO a user
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
        index: true
    }
}, {
    timestamps: true
});

// Compound index to ensure unique requests between two people (optional but good practice)
// This prevents A from sending multiple pending requests to B
FriendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);

module.exports = FriendRequest;
