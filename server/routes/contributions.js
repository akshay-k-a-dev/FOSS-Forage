const express = require('express');
const router = express.Router();
const Contribution = require('../models/Contribution');
const auth = require('../middleware/auth');

// @route   GET /api/contributions
// @desc    Get all contributions
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const type = req.query.type;
    const status = req.query.status;

    let query = {};

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    const contributions = await Contribution.find(query)
      .populate('contributor', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contribution.countDocuments(query);

    res.json({
      contributions,
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

// @route   POST /api/contributions
// @desc    Submit a contribution
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { type, title, description, repositoryUrl, technologies, impact } = req.body;

    const contribution = new Contribution({
      type,
      title,
      description,
      repositoryUrl,
      technologies,
      impact,
      contributor: req.user.id
    });

    await contribution.save();
    await contribution.populate('contributor', 'username firstName lastName');

    res.json(contribution);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/contributions/:id
// @desc    Get contribution by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id)
      .populate('contributor', 'username firstName lastName');

    if (!contribution) {
      return res.status(404).json({ msg: 'Contribution not found' });
    }

    res.json(contribution);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Contribution not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;