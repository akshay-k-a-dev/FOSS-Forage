const express = require('express');
const router = express.Router();
const News = require('../models/News');
const auth = require('../middleware/auth');

// @route   GET /api/news
// @desc    Get all news articles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const news = await News.find({ status: 'published' })
      .populate('author', 'username firstName lastName')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await News.countDocuments({ status: 'published' });

    res.json({
      news,
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

// @route   POST /api/news
// @desc    Create a news article
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, status } = req.body;

    const news = new News({
      title,
      content,
      excerpt,
      category,
      tags,
      author: req.user.id,
      status: status || 'draft'
    });

    if (status === 'published') {
      news.publishedAt = new Date();
    }

    await news.save();
    await news.populate('author', 'username firstName lastName');

    res.json(news);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/news/:id
// @desc    Get news article by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('author', 'username firstName lastName');

    if (!news) {
      return res.status(404).json({ msg: 'News article not found' });
    }

    // Increment views
    news.views += 1;
    await news.save();

    res.json(news);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'News article not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;