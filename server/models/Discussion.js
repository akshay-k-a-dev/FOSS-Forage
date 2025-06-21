const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
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
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply'
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  },
  lastReply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply'
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reply count
discussionSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

// Virtual for like count
discussionSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Index for search and performance
discussionSchema.index({ title: 'text', content: 'text', tags: 'text' });
discussionSchema.index({ category: 1, createdAt: -1 });
discussionSchema.index({ author: 1, createdAt: -1 });
discussionSchema.index({ lastActivity: -1 });

// Update last activity when discussion is modified
discussionSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastActivity = new Date();
  }
  next();
});

module.exports = mongoose.model('Discussion', discussionSchema);