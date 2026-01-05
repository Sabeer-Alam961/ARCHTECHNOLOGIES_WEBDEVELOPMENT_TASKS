const socketIo = require('socket.io');

let io;

const init = (server) => {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('New Client Connected: ' + socket.id);

        socket.on('join', (userId) => {
            if (userId) {
                socket.join('user_' + userId);
                console.log(`User ${userId} joined room user_${userId}`);
                // Broadcast user online status
                io.emit('user_online', userId);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client Disconnected: ' + socket.id);
            // In a real app, map socket.id to userId to emit offline status
            // io.emit('user_offline', userId);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

module.exports = { init, getIO };
