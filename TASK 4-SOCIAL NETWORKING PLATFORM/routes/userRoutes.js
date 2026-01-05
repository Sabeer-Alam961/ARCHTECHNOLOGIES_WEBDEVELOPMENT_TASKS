const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    sendFriendRequest,
    acceptFriendRequest,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/friend-request/:id', protect, sendFriendRequest);
router.put('/friend-request/:requestId/accept', protect, acceptFriendRequest);

module.exports = router;
