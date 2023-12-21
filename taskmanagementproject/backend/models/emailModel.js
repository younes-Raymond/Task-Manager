const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const EmailLog = mongoose.model('EmailLog', emailSchema);

module.exports = EmailLog;
