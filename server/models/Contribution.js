const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['developer', 'writer', 'mentor', 'community']
  },
  linkedin: {
    type: String,
    match: [/^https:\/\/.*linkedin\.com\/.*/, 'Please enter a valid LinkedIn URL']
  },
  github: {
    type: String,
    match: [/^https:\/\/.*github\.com\/.*/, 'Please enter a valid GitHub URL']
  },
  motivation: {
    type: String,
    required: [true, 'Motivation is required'],
    minlength: [50, 'Please write at least 50 characters'],
    maxlength: [1000, 'Please keep your response under 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'contacted'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewNotes: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for performance
contributionSchema.index({ status: 1, createdAt: -1 });
contributionSchema.index({ role: 1, status: 1 });
contributionSchema.index({ email: 1 });

module.exports = mongoose.model('Contribution', contributionSchema);