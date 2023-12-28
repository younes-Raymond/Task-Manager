const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workers',
    },
  ],
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workers',
      },
      content: {
        type: {
          type: String,
          enum: ['text', 'image', 'video', 'document'],
          required: true,
        },
        data: String,
        avatars: {
          senderAvatar:{
            type: String,
            required: true,
          },

          otherAvatar: {
            type: String,
            required: true,
          } 
        },
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
