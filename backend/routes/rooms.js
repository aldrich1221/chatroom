// backend/routes/rooms.js
const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const User = require('../models/User');

// Create a new room
router.post('/create', async (req, res) => {
  const { name,userId,userName } = req.body;

  try {
    const user = await User.findOne({ uid:  userId  });

    const newRoom = new Room({ name:name ,users:[userId],usersName:[user.userName]});
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: 'Error creating room' });
  }
});

// Add a user to a room
router.post('/addUser', async (req, res) => {
  console.log("adduser to room",req.body)
  const { roomId, userId} = req.body;

  try {
    const room = await Room.findById(roomId);
    console.log("found room",room)
    if (!room) return res.status(404).json({ error: 'Room not found' });

    // const user = await User.find({ userId }).sort({ timestamp: 1 }).exec();
    const user = await User.findOne({ uid:  userId  });
    // const user = await User.findById(userId);
    console.log("found user",user)
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!room.users.includes(user.uid)) {
      room.users.push(user.uid);
      room.usersName.push(user.userName)
      await room.save();
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Error adding user to room' });
  }
});

// Remove a user from a room
router.post('/removeUser', async (req, res) => {
  const { roomId, userId } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    room.users = room.users.filter(user => user.toString() !== userId);
    await room.save();
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Error removing user from room' });
  }
});

// Delete a room
router.delete('/delete/:roomId', async (req, res) => {
  const { roomId } = req.params;

  try {
    await Room.findByIdAndDelete(roomId);
    res.status(200).json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting room' });
  }
});

// Get all rooms for a specific user
router.get('/userRooms/:userId', async (req, res) => {
    console.log("userrooms..")
  const { userId } = req.params;

  try {
    const rooms = await Room.find({ users: { $in: [userId] } });
    console.log("rooms with uid",rooms)
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching rooms' });
  }
});

module.exports = router;
