const express = require('express');
const http = require('http'); // Import http
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { init } = require('./socket/socket'); // Import socket init

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app); // Create HTTP server

// Initialize Socket.IO
init(server);

// Middleware
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: false }));
app.use(cors()); // Enable CORS
app.use(helmet()); // Security headers
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Logging
}

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
