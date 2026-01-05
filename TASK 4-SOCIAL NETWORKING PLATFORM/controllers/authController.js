const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../database/models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { username, email, password, avatar } = req.body;

        if (!username || !email || !password) {
            res.status(400);
            throw new Error('Please add all fields');
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            profile: {
                avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            }
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                profile: user.profile,
                token: generateToken(user.id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        // Pass error to error handler middleware
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user.id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw new Error(error.message);
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const { _id, username, email } = await User.findById(req.user.id);

        res.status(200).json({
            id: _id,
            username,
            email,
        });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
