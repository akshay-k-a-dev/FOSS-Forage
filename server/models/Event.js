const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  location: {
    type: String,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  meetingLink: {
    type: String,
    maxlength: [500, 'Meeting link cannot exceed 500 characters']
  },
  image: {
    type: String,
    default: ''
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  speakers: [{
    name: {
      type: String,
      required: true
    },
    bio: String,
    avatar: String,
    social: {
      twitter: String,
      linkedin: String,
      github: String
    }
  }],
  agenda: [{
    time: String,
    title: String,
    description: String,
    speaker: String
  }],
  maxAttendees: {
    type: Number,
    default: 0 // 0 means unlimited
  },
  registrations: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    }
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  price: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  photos: [{
    url: String,
    caption: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for registration count
eventSchema.virtual('registrationCount').get(function() {
  return this.registrations.filter(reg => reg.status === 'registered').length;
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  if (this.maxAttendees === 0) return null; // Unlimited
  return this.maxAttendees - this.registrationCount;
});

// Index for search and performance
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });
eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ organizer: 1, createdAt: -1 });

module.exports = mongoose.model('Event', eventSchema);