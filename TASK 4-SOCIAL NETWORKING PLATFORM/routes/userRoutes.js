const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequests,
    removeFriend,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const { uploadSingle } = require('../middleware/uploadMiddleware');

router.get('/:id', protect, getUserProfile);
router.put('/profile', protect, uploadSingle('avatar'), updateUserProfile);
router.get('/friend-requests', protect, getFriendRequests);
router.post('/friend-request/:id', protect, sendFriendRequest);
router.put('/friend-request/:requestId/accept', protect, acceptFriendRequest);
router.put('/friend-request/:requestId/reject', protect, rejectFriendRequest);
router.delete('/friends/:id', protect, removeFriend);

module.exports = router;
