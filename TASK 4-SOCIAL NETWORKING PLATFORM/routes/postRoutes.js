const express = require('express');
const router = express.Router();
const {
    createPost,
    getFeed,
    likePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getFeed)
    .post(protect, createPost);

router.put('/:id/like', protect, likePost);

module.exports = router;
