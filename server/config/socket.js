const setupSocketIO = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join discussion room
    socket.on('join-discussion', (discussionId) => {
      socket.join(`discussion-${discussionId}`);
      console.log(`User ${socket.id} joined discussion ${discussionId}`);
    });

    // Leave discussion room
    socket.on('leave-discussion', (discussionId) => {
      socket.leave(`discussion-${discussionId}`);
      console.log(`User ${socket.id} left discussion ${discussionId}`);
    });

    // Handle new reply
    socket.on('new-reply', (data) => {
      socket.to(`discussion-${data.discussionId}`).emit('reply-added', data);
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      socket.to(`discussion-${data.discussionId}`).emit('user-typing', {
        userId: data.userId,
        username: data.username
      });
    });

    socket.on('stop-typing', (data) => {
      socket.to(`discussion-${data.discussionId}`).emit('user-stop-typing', {
        userId: data.userId
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = { setupSocketIO };