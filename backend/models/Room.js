const mongoose = require('mongoose');

// Define the basicUserSchema
const basicUserSchema = new mongoose.Schema({
  uid: { type: String, required: true },  // No uniqueness constraint
  userName: { type: String, required: false }
});

// Define the roomSchema, referencing the basicUserSchema
const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  users: [basicUserSchema]  // Allowing duplicates in users
});

// Export the Room model
module.exports = mongoose.model('Room', roomSchema);