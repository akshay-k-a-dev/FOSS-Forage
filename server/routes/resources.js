const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');

// @route   GET /api/resources
// @desc    Get all resources
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    let query = { isApproved: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const resources = await Resource.find(query)
      .populate('submittedBy', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resource.countDocuments(query);

    res.json({
      resources,
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

// @route   POST /api/resources
// @desc    Submit a new resource
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, url, category, type, tags } = req.body;

    const resource = new Resource({
      title,
      description,
      url,
      category,
      type,
      tags,
      submittedBy: req.user.id
    });

    await resource.save();
    await resource.populate('submittedBy', 'username firstName lastName');

    res.json(resource);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/resources/:id
// @desc    Get resource by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('submittedBy', 'username firstName lastName')
      .populate('approvedBy', 'username firstName lastName');

    if (!resource) {
      return res.status(404).json({ msg: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;