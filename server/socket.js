// Map to store active users in each room
const rooms = {};

const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a meeting room
    socket.on('join-room', ({ roomId, userId, userName }) => {
      console.log(`User ${userName} (${userId}) joined room ${roomId}`);
      
      // Join the socket room
      socket.join(roomId);
      
      // Initialize room if it doesn't exist
      if (!rooms[roomId]) {
        rooms[roomId] = { users: {}, host: userId };
      }
      
      // Add user to the room
      rooms[roomId].users[userId] = {
        id: userId,
        name: userName,
        socketId: socket.id,
        isHost: rooms[roomId].host === userId,
        video: true,
        audio: true
      };
      
      // Notify other users in the room about the new user
      socket.to(roomId).emit('user-joined', {
        userId,
        userName,
        isHost: rooms[roomId].host === userId
      });
      
      // Send the list of existing users to the new user
      socket.emit('room-users', Object.values(rooms[roomId].users));
      
      // Handle chat messages
      socket.on('send-message', (message) => {
        io.to(roomId).emit('receive-message', message);
      });
      
      // Handle WebRTC signaling
      socket.on('sending-signal', ({ signal, to }) => {
        io.to(rooms[roomId].users[to].socketId).emit('user-joined-with-signal', {
          signal,
          from: userId
        });
      });
      
      socket.on('returning-signal', ({ signal, to }) => {
        io.to(rooms[roomId].users[to].socketId).emit('receiving-returned-signal', {
          signal,
          from: userId
        });
      });
      
      // Handle audio/video toggle
      socket.on('toggle-audio', (isOn) => {
        if (rooms[roomId] && rooms[roomId].users[userId]) {
          rooms[roomId].users[userId].audio = isOn;
          socket.to(roomId).emit('user-toggle-audio', { userId, isOn });
        }
      });
      
      socket.on('toggle-video', (isOn) => {
        if (rooms[roomId] && rooms[roomId].users[userId]) {
          rooms[roomId].users[userId].video = isOn;
          socket.to(roomId).emit('user-toggle-video', { userId, isOn });
        }
      });
      
      // Handle captions
      socket.on('send-caption', (caption) => {
        socket.to(roomId).emit('receive-caption', {
          userId,
          userName,
          caption
        });
      });
      
      // Host controls
      socket.on('mute-user', ({ targetUserId }) => {
        if (rooms[roomId] && rooms[roomId].users[userId] && rooms[roomId].users[userId].isHost) {
          if (rooms[roomId].users[targetUserId]) {
            io.to(rooms[roomId].users[targetUserId].socketId).emit('host-muted-you');
          }
        }
      });
      
      socket.on('remove-user', ({ targetUserId }) => {
        if (rooms[roomId] && rooms[roomId].users[userId] && rooms[roomId].users[userId].isHost) {
          if (rooms[roomId].users[targetUserId]) {
            io.to(rooms[roomId].users[targetUserId].socketId).emit('kicked-from-meeting');
            
            // Remove user from the room
            delete rooms[roomId].users[targetUserId];
            
            // Notify others
            socket.to(roomId).emit('user-left', { userId: targetUserId });
          }
        }
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User ${userName} (${userId}) disconnected from room ${roomId}`);
        
        if (rooms[roomId] && rooms[roomId].users[userId]) {
          // Remove user from the room
          delete rooms[roomId].users[userId];
          
          // Notify others
          socket.to(roomId).emit('user-left', { userId });
          
          // If room is empty, remove it
          if (Object.keys(rooms[roomId].users).length === 0) {
            delete rooms[roomId];
          } 
          // If the host left, assign a new host
          else if (rooms[roomId].host === userId) {
            const newHostId = Object.keys(rooms[roomId].users)[0];
            rooms[roomId].host = newHostId;
            rooms[roomId].users[newHostId].isHost = true;
            
            io.to(roomId).emit('new-host', { userId: newHostId });
          }
        }
      });
    });

    // Leave meeting
    socket.on('leave-meeting', ({ roomId, userId }) => {
      if (rooms[roomId] && rooms[roomId].users[userId]) {
        // Remove user from the room
        delete rooms[roomId].users[userId];
        
        // Notify others
        socket.to(roomId).emit('user-left', { userId });
        
        // If room is empty, remove it
        if (Object.keys(rooms[roomId].users).length === 0) {
          delete rooms[roomId];
        } 
        // If the host left, assign a new host
        else if (rooms[roomId].host === userId) {
          const newHostId = Object.keys(rooms[roomId].users)[0];
          rooms[roomId].host = newHostId;
          rooms[roomId].users[newHostId].isHost = true;
          
          io.to(roomId).emit('new-host', { userId: newHostId });
        }
      }
      
      socket.leave(roomId);
    });
  });
};

module.exports = { setupSocketHandlers };