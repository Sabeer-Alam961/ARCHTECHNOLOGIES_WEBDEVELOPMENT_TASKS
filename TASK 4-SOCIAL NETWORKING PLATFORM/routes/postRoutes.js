const express = require('express');
const router = express.Router();
const {
    createPost,
    getFeed,
    likePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

const { uploadSingle } = require('../middleware/uploadMiddleware');

router.route('/')
    .get(protect, getFeed)
    .post(protect, uploadSingle('image'), createPost);

router.put('/:id/like', protect, likePost);

module.exports = router;
