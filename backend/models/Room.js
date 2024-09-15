const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  users: [{ type: String }],
  usersName: [{ type: String }]
});

module.exports = mongoose.model('Room', roomSchema);