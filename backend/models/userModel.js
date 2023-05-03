// models/UserTaken.js

const mongoose = require('mongoose');

const userTakenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  takenAt: {
    type: Date,
    default: Date.now,
  },
});

const UserTaken = mongoose.model('UserTaken', userTakenSchema);

module.exports = UserTaken;