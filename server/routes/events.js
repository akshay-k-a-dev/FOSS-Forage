const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const upcoming = req.query.upcoming === 'true';

    let query = { status: 'published' };

    if (upcoming) {
      query.startDate = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .populate('organizer', 'username firstName lastName')
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments(query);

    res.json({
      events,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      isOnline,
      meetingLink,
      maxAttendees,
      tags
    } = req.body;

    const event = new Event({
      title,
      description,
      startDate,
      endDate,
      location,
      isOnline,
      meetingLink,
      maxAttendees,
      tags,
      organizer: req.user.id
    });

    await event.save();
    await event.populate('organizer', 'username firstName lastName');

    res.json(event);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'username firstName lastName')
      .populate('attendees', 'username firstName lastName');

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/events/:id/attend
// @desc    Attend an event
// @access  Private
router.post('/:id/attend', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check if user is already attending
    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already attending this event' });
    }

    // Check if event is full
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ msg: 'Event is full' });
    }

    event.attendees.push(req.user.id);
    await event.save();

    res.json({ msg: 'Successfully registered for event' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;