const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
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
      ref: 'User',
    },
    workerName: {
       type: String,
       required: true,
    },
    expectation: {
      type: String,
    },
    deadlineDays: {
      type: Number, 
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
