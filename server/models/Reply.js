const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  discussion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discussion',
    required: true
  },
  parentReply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply'
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'deleted', 'hidden'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
replySchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Index for performance
replySchema.index({ discussion: 1, createdAt: 1 });
replySchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Reply', replySchema);