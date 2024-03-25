const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { StringDecoder } = require('string_decoder');


const WorkersSchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  chats: [
    {
      chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
      },
      type: {
        type: String,
        enum: ['private', 'group'],
        required: true,
      },
    },
  ],
  position: {
    type:String,
    required: true,
    default: "unknown",
  },
  salary: {
   type: Number,
   required: true,
   default: 0,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
    default:'other',
  },
  nationalId: {
    type: String,
    required: false,
    unique: true
},
  phoneNumber: {
    type: String,
    required: true,
    default:'+212 0000'
  },
  role: {
    type: String,
    enum: ['user', 'admin','unknown'],
    default: 'unknown',
  },
  legalInfo: {
    type: String,
    required:false,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
      default: "N/A",
    },
    url: {
      type: String,
      default: "https://th.bing.com/th/id/R.7daf567ab2f8bd23c51e62b458656b7f?rik=0WX6sYDYJqklbg&riu=http%3a%2f%2fwww.ampnat.com%2fwp-content%2fuploads%2fFamily-Series-4-800x533.jpg&ehk=nk4I9LfG7SSMWMIES9OGdxiz7LCf7XcqMHSR4sq%2bxeA%3d&risl=&pid=ImgRaw&r=0",
    },
  },
  registerAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  receiveUpdates: {
    type: Boolean,
    default: true,
  },
});


WorkersSchema.methods.generateToken = function() {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};


WorkersSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});


WorkersSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


WorkersSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};



WorkersSchema.methods.getResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};


const Workers = mongoose.model('Workers', WorkersSchema);

module.exports = Workers;

