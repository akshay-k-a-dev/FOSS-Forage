const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    unique: true
  },
  source: {
    id: String,
    name: {
      type: String,
      required: true
    }
  },
  author: String,
  urlToImage: String,
  publishedAt: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['FOSS', 'Linux', 'Tech', 'Security', 'Programming']
  },
  sourcePriority: {
    type: Number,
    default: 2
  },
  isActive: {
    type: Boolean,
    default: true
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
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
newsSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Index for search and performance
newsSchema.index({ title: 'text', description: 'text' });
newsSchema.index({ publishedAt: -1, isActive: 1 });
newsSchema.index({ category: 1, publishedAt: -1 });
newsSchema.index({ url: 1 });

module.exports = mongoose.model('News', newsSchema);