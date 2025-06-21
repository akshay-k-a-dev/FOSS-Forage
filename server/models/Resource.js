const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Frontend Development',
      'Backend Development',
      'Mobile Development',
      'DevOps & CI/CD',
      'Cloud Native',
      'Security & Compliance',
      'Data & AI',
      'Development Tools',
      'System Tools',
      'Documentation'
    ]
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['framework', 'library', 'tool', 'platform', 'language', 'book', 'app']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  githubData: {
    stars: Number,
    forks: Number,
    language: String,
    lastUpdated: Date
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
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
  lastChecked: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
resourceSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Index for search and performance
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
resourceSchema.index({ category: 1, type: 1 });
resourceSchema.index({ isApproved: 1, isActive: 1 });

module.exports = mongoose.model('Resource', resourceSchema);