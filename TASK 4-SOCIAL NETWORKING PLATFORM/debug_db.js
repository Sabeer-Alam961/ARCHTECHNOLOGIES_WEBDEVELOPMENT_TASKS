const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./database/models/User');
const Post = require('./database/models/Post');
const Comment = require('./database/models/Comment');

dotenv.config();

const debugDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to: ${conn.connection.name}`);
        console.log(`Host: ${conn.connection.host}`);

        console.log('\n--- Collection Counts ---');

        const userCount = await User.countDocuments();
        console.log(`Users: ${userCount}`);

        const postCount = await Post.countDocuments();
        console.log(`Posts: ${postCount}`);

        const commentCount = await Comment.countDocuments();
        console.log(`Comments: ${commentCount}`);

        if (commentCount > 0) {
            console.log('\n--- Latest Comment ---');
            const latest = await Comment.findOne().sort({ createdAt: -1 });
            console.log(latest);
        } else {
            console.log('\nWARNING: No comments found in this database.');
        }

        console.log('\nIf counts are > 0 but you see 0 in Compass, check:');
        console.log('1. Are you connected to localhost:27017?');
        console.log(`2. Are you looking at database: "${conn.connection.name}"?`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debugDB();
