const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: [String], required: true },
  applicationDetails: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
