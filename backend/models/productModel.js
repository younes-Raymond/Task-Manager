const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 200
  },
  images: {
    public_id:{
      type:String,
      required:true
    },
    url: {
      type:String,
      required:true
    }
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    max: 1000000
  },
  category: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Material = mongoose.model('Material', MaterialSchema);

module.exports = Material;