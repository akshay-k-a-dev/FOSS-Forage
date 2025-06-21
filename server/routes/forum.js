const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Discussion = require('../models/Discussion');
const auth = require('../middleware/auth');

// @route   GET /api/forum/categories
// @desc    Get all forum categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/forum/categories
// @desc    Create a new category
// @access  Private (Admin only)
router.post('/categories', auth, async (req, res) => {
  try {
    const { name, description, icon, color, order } = req.body;

    const category = new Category({
      name,
      description,
      icon,
      color,
      order
    });

    await category.save();
    res.json(category);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/forum/stats
// @desc    Get forum statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const totalDiscussions = await Discussion.countDocuments();
    const totalCategories = await Category.countDocuments();
    
    // Get recent discussions
    const recentDiscussions = await Discussion.find()
      .populate('author', 'username firstName lastName')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalDiscussions,
      totalCategories,
      recentDiscussions
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;