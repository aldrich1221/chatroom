const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');
// Route to sign up a new user
router.post('/signup', async (req, res) => {
  const { uid, email, userName } = req.body;
  try {
    const user = new User({
      uid:uid, // Set uid as ObjectId
      email: email,
      userName: userName
    });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Error saving user' });
  }
});

// Route to get user info by UID
router.get('/:uid', async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await User.findOne({ uid });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
});


// // Route to search user info by UserName
// router.get('/:userName', async (req, res) => {
//   const { uid } = req.params;
//   try {
//     const user = await User.find({ userName:userName});
//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ error: 'Error fetching user' });
//   }
// });

// Route to add a friend
router.post('/addFriend', async (req, res) => {
  console.log("addFriend");
  const { userId, friendId } = req.body;
  try {
    // const user = await User.findById(userId);
    const user = await User.findOne({userId});
    // const friend = await User.findById(friendId);
    const friend  = await User.findOne({friendId});
    console.log(user,friend)
    if (!user || !friend) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
      res.json({ message: 'Friend added successfully' });
    } else {
      res.json({ message: 'User is already a friend' });
    }
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ error: 'Error adding friend' });
  }
});

router.post('/search', async (req, res) => {
 
  const { query } = req.query;
  console.log("serach...",query)
  try {
    const users = await User.find({
      $or: [{ email: new RegExp(query, 'i') }, { userName: new RegExp(query, 'i') }]
    });
 
    console.log("search done,",users)
    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Error searching users' });
  }
});

module.exports = router;
