const mongoose = require('mongoose');

console.log('Verifying Schemas...');

try {
    const User = require('./database/models/User');
    const Post = require('./database/models/Post');
    const Comment = require('./database/models/Comment');
    const Notification = require('./database/models/Notification');
    const FriendRequest = require('./database/models/FriendRequest');

    console.log('✅ User Schema loaded successfully');
    console.log('✅ Post Schema loaded successfully');
    console.log('✅ Comment Schema loaded successfully');
    console.log('✅ Notification Schema loaded successfully');
    console.log('✅ FriendRequest Schema loaded successfully');

    console.log('\nAll schemas are valid Mongoose models from a syntax perspective.');

} catch (error) {
    console.error('❌ Error loading schemas:', error.message);
    process.exit(1);
}
