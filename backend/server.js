// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cors = require('cors');
const app = express();

// app.use(cors()); // This will allow all origins by default
// app.use(cors({ origin: 'http://localhost:3000' }));
const server = http.createServer(app);
// const io = socketIo(server);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.json());

// In-memory store for message history by room ID
const messageHistoryByRoom = {};

app.get('/messages/:roomId', (req, res) => {
  const { roomId } = req.params;
  res.json(messageHistoryByRoom[roomId] || []);
});
app.get('/test', (req, res) => {
  
  res.json("test ok!");
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);

    // Send message history to the newly connected client
    socket.emit('loadMessages', messageHistoryByRoom[roomId] || []);
  });

  socket.on('message', ({ roomId, message }) => {
    console.log(`Message received in room ${roomId}: `, message);
    if (!messageHistoryByRoom[roomId]) {
      messageHistoryByRoom[roomId] = [];
    }
    console.log("GET Message..",roomId,message)
    messageHistoryByRoom[roomId].push(message); // Store message in history
    io.to(roomId).emit('message', message); // Broadcast message to all clients in the room
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
