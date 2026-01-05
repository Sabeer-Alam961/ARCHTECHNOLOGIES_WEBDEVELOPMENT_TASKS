const Comment = require('../database/models/Comment');
const Post = require('../database/models/Post');
const createNotification = require('../utils/notificationHelper');

// @desc    Add a comment
// @route   POST /api/comments/:postId
// @access  Protected
const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const postId = req.params.postId;

        if (!content) {
            res.status(400);
            throw new Error('Comment cannot be empty');
        }

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404);
            throw new Error('Post not found');
        }

        const comment = await Comment.create({
            post: postId,
            author: req.user.id,
            content,
        });

        // Create Notification
        await createNotification(post.author, 'comment', req.user.id, postId);

        // Populate author for immediate display
        await comment.populate('author', 'username profile.avatar');

        res.status(201).json(comment);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Protected
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'username profile.avatar')
            .sort({ createdAt: 1 });

        res.json(comments);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

module.exports = {
    addComment,
    getComments,
};
