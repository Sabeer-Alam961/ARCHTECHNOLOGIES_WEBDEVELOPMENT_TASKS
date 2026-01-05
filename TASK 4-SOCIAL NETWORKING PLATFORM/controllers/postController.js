const Post = require('../database/models/Post');
const User = require('../database/models/User');
const createNotification = require('../utils/notificationHelper');

// @desc    Create a post
// @route   POST /api/posts
// @access  Protected
const createPost = async (req, res) => {
    try {
        const { content, privacy, image } = req.body;

        if (!content && !image) {
            res.status(400);
            throw new Error('Post must have content or image');
        }

        const post = await Post.create({
            author: req.user.id,
            content: {
                text: content || '',
                image: image || '',
            },
            privacy: privacy || 'public',
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

// @desc    Get all posts (Feed)
// @route   GET /api/posts
// @access  Protected
const getFeed = async (req, res) => {
    try {
        // Get current user's friends
        const user = await User.findById(req.user.id);
        const friendsList = user.friends;

        // Find posts by user or friends
        // Filter by privacy later if needed, for now simplistic feed
        const posts = await Post.find({
            author: { $in: [...friendsList, req.user.id] },
        })
            .populate('author', 'username profile.avatar')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

// @desc    Like / Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Protected
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404);
            throw new Error('Post not found');
        }

        // Check if post has already been liked
        if (post.likes.includes(req.user.id)) {
            // Unlike
            post.likes = post.likes.filter(
                (id) => id.toString() !== req.user.id
            );
        } else {
            // Like
            post.likes.push(req.user.id);
            // Create Notification
            await createNotification(post.author, 'like', req.user.id, post.id);
        }

        await post.save();

        res.json(post.likes);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

module.exports = {
    createPost,
    getFeed,
    likePost,
};
