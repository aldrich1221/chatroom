const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const roomRoutes = require('./routes/rooms');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const MessageData = require('./models/MessageData');
// Load environment variables from .env file
dotenv.config();

const app = express();
const server = http.createServer(app);

// Set up CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.REACT_URI,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.json());
// Test API route
app.get('/test-api', (req, res) => {
  res.json({ message: 'Test API is working!' });
});

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Route handlers
app.use('/rooms', roomRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', async (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);

    try {
      const messages = await MessageData.find({ roomId }).sort({ timestamp: 1 }).exec();
      socket.emit('loadMessages', messages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  });

  socket.on('message', async ({ roomId, message, senderId }) => {
    console.log(`Message received in room ${roomId}: `, message);

    const newMessage = new MessageData({ roomId, message, senderId });
    try {
      await newMessage.save();
      io.to(roomId).emit('message', { message, senderId });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
