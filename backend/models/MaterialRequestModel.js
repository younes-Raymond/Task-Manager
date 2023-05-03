const mongoose = require('mongoose');

const MaterialRequestSchema = new mongoose.Schema({
  materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserTaken', required: true },
  requestDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedDate: { type: Date },
});

const MaterialRequest = mongoose.model('MaterialRequest', MaterialRequestSchema);

module.exports = MaterialRequest;
