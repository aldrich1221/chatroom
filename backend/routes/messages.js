const express = require('express');
const router = express.Router();
const MessageData = require('../models/MessageData');

// Route to get messages for a specific room
router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await MessageData.find({ roomId }).sort({ timestamp: 1 }).exec();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

module.exports = router;
