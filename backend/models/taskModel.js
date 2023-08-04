const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending',
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workers', 
    required: true,
  },
  Expectation: {
  type:String,
  required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

taskSchema.index({ worker: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
