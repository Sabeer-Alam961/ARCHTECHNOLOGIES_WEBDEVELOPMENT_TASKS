const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * User Schema
 * Represents a user in the social network.
 */
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        index: true // Indexed for fast lookup by username
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true // Indexed for fast lookup by email
    },
    password: {
        type: String, // Store Hashed Password
        required: true
    },
    profile: {
        firstName: { type: String, trim: true },
        lastName: { type: String, trim: true },
        bio: { type: String, maxlength: 200 },
        avatar: { type: String, default: '' }, // URL to image
        website: { type: String, trim: true }
    },
    // Friends list - Array of User IDs
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    privacySettings: {
        isPrivate: { type: Boolean, default: false }, // If true, only friends see posts
        allowFriendRequests: { type: Boolean, default: true }
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
