const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: [String],
    required: true
  },
  applicationDetails: {
    email: {
      type: String,
      required: true,
      default: 'company@example.com' // Set a default email value for the company
    },
    phone: {
      type: String,
      required: true,
      default: '+1234567890' // Set a default phone number value for the company
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
