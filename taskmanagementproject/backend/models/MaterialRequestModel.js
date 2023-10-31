const mongoose = require('mongoose');

const MaterialRequestSchema = new mongoose.Schema({
  materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workers', required: true },
  userId_of_Taken: { type: mongoose.Schema.Types.ObjectId, ref: 'Workers', required: true },
  requestDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedDate: { type: Date },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workers' },
  requesterName: { type: String, required: true },
  requesterAvatar: { type: String, required: true },
  requesterDestination: { type: String, required: true },
  materialPicture: { type: String, required: true },
});



const MaterialRequest = mongoose.model('MaterialRequest', MaterialRequestSchema);

module.exports = MaterialRequest;



