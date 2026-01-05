const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Post Schema
 * Represents a user's post (text, image, etc).
 */
const PostSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Indexed to quickly find posts by a specific user
    },
    content: {
        text: { type: String, trim: true, maxlength: 2000 },
        image: { type: String, default: '' } // URL to max 1 image for simplicity
    },
    // Array of User IDs who liked the post
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Privacy specific to this post
    privacy: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'public'
    }
}, {
    timestamps: true // timestamp for when post was created
});

// Index to help sort posts by date quickly
PostSchema.index({ createdAt: -1 });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
