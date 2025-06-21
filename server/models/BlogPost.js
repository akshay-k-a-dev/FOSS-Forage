const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featuredImage: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'System Administration',
      'Security',
      'Containers',
      'Programming',
      'Tutorials',
      'News',
      'Community',
      'Open Source'
    ]
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
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
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  readTime: {
    type: Number, // in minutes
    default: 5
  },
  seoTitle: String,
  seoDescription: String,
  isEditorsPick: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
blogPostSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
blogPostSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Generate slug before saving
blogPostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Calculate read time based on content
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  
  next();
});

// Index for search and performance
blogPostSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ author: 1, createdAt: -1 });
blogPostSchema.index({ slug: 1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);