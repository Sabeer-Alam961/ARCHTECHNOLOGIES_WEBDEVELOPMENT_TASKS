const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Comment Schema
 * Represents a comment on a post.
 */
const CommentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        index: true // Indexed to quickly load all comments for a post
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Index to help sort comments chronologically
CommentSchema.index({ createdAt: 1 });

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
