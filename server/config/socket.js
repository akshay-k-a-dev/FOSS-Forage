const jwt = require('jsonwebtoken');
const User = require('../models/User');

const setupSocketIO = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        socket.user = user;
      }
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user ? socket.user.username : 'Anonymous'}`);

    // Join user to their personal room
    if (socket.user) {
      socket.join(`user_${socket.user._id}`);
    }

    // Forum events
    socket.on('join_discussion', (discussionId) => {
      socket.join(`discussion_${discussionId}`);
    });

    socket.on('leave_discussion', (discussionId) => {
      socket.leave(`discussion_${discussionId}`);
    });

    // Real-time notifications
    socket.on('mark_notification_read', async (notificationId) => {
      if (socket.user) {
        // Update notification status in database
        // Emit to user's room
        socket.to(`user_${socket.user._id}`).emit('notification_updated', {
          id: notificationId,
          read: true
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user ? socket.user.username : 'Anonymous'}`);
    });
  });

  return io;
};

module.exports = { setupSocketIO };