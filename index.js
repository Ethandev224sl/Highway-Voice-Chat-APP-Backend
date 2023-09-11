const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Store registered users
let users = [];
// Store users in rooms
let rooms = {
  room1: [],
  room2: [],
  room3: [],
  room4: []
};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

// Handle socket connections
io.on('connection', (socket) => {

  // Listen for new user joining a room
  socket.on('joinRoom', (data) => {
    const { room } = data;
    
    // Add user to the specified room
    rooms[room].push(socket.id);

    // Notify all users in the room about the new user
    io.to(socket.id).emit('userJoined', { userCount: rooms[room].length });

    console.log(`successfully joined ${socket.id}, Number of users: ${rooms[room].length}`);
    // Join the room
    socket.join(room);
});
  
  // Listen for audio data from sender
  socket.on('audio', (data) => {
    const { room, audioData } = data;
    // Broadcast the audio to all users in the same room
    io.to(rooms[room]).emit('broadcastAudio', { audioData });
    console.log('broadcasting');
    console.log(rooms[room]);
  });
  
  // Listen for user leaving a room
  socket.on('leaveRoom', (data) => {
    const { room } = data;
    
    // Remove user from the room
    rooms[room] = rooms[room].filter(user => user !== socket.id);
    
    // Notify all users in the room about the user leaving
    io.to(room).emit('userLeft', { userCount: rooms[room].length });
    console.log(`${socket.id} has left ${room}, Number of users: ${rooms[room].length}`)
    // Leave the room
    socket.leave(room);
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server started on port 3000');
});