const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Discussion = require('../models/Discussion');
const Reply = require('../models/Reply');
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');
const { paginate } = require('../middleware/pagination');
const router = express.Router();

// @desc    Get all discussions
// @route   GET /api/discussions
// @access  Public
router.get('/', [
  query('category').optional().isMongoId().withMessage('Invalid category ID'),
  query('search').optional().isLength({ max: 100 }).withMessage('Search query too long'),
  query('sort').optional().isIn(['latest', 'popular', 'oldest']).withMessage('Invalid sort option')
], paginate(Discussion), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { category, search, sort = 'latest' } = req.query;
    
    // Build query
    let query = { status: 'active' };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { views: -1, lastActivity: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { isPinned: -1, lastActivity: -1 };
    }

    const discussions = await Discussion.find(query)
      .populate('author', 'username avatar reputation')
      .populate('category', 'name slug color')
      .populate('lastReply', 'author createdAt')
      .populate({
        path: 'lastReply',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      })
      .sort(sortOption)
      .limit(req.pagination.limit)
      .skip(req.pagination.skip);

    const total = await Discussion.countDocuments(query);

    res.json({
      success: true,
      data: discussions,
      pagination: {
        ...req.pagination,
        total,
        pages: Math.ceil(total / req.pagination.limit)
      }
    });
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single discussion
// @route   GET /api/discussions/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('author', 'username avatar reputation badges')
      .populate('category', 'name slug color')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username avatar reputation badges'
        },
        options: { sort: { createdAt: 1 } }
      });

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Increment views
    discussion.views += 1;
    await discussion.save();

    res.json({
      success: true,
      data: discussion
    });
  } catch (error) {
    console.error('Get discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new discussion
// @route   POST /api/discussions
// @access  Private
router.post('/', protect, [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 10, max: 10000 })
    .withMessage('Content must be between 10 and 10000 characters'),
  body('category')
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('tags')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Maximum 5 tags allowed')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, content, category, tags } = req.body;

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    const discussion = await Discussion.create({
      title,
      content,
      author: req.user.id,
      category,
      tags: tags || []
    });

    await discussion.populate('author', 'username avatar reputation');
    await discussion.populate('category', 'name slug color');

    // Update user stats
    await req.user.updateOne({ $inc: { 'stats.postsCount': 1 } });

    res.status(201).json({
      success: true,
      message: 'Discussion created successfully',
      data: discussion
    });
  } catch (error) {
    console.error('Create discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update discussion
// @route   PUT /api/discussions/:id
// @access  Private
router.put('/:id', protect, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10, max: 10000 })
    .withMessage('Content must be between 10 and 10000 characters'),
  body('tags')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Maximum 5 tags allowed')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Check ownership or admin/moderator role
    if (discussion.author.toString() !== req.user.id && !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this discussion'
      });
    }

    const { title, content, tags } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (tags) updateData.tags = tags;

    const updatedDiscussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'username avatar reputation')
     .populate('category', 'name slug color');

    res.json({
      success: true,
      message: 'Discussion updated successfully',
      data: updatedDiscussion
    });
  } catch (error) {
    console.error('Update discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete discussion
// @route   DELETE /api/discussions/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    // Check ownership or admin/moderator role
    if (discussion.author.toString() !== req.user.id && !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this discussion'
      });
    }

    // Delete all replies
    await Reply.deleteMany({ discussion: req.params.id });

    // Delete discussion
    await discussion.deleteOne();

    // Update user stats
    await req.user.updateOne({ $inc: { 'stats.postsCount': -1 } });

    res.json({
      success: true,
      message: 'Discussion deleted successfully'
    });
  } catch (error) {
    console.error('Delete discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Like/Unlike discussion
// @route   POST /api/discussions/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    const existingLike = discussion.likes.find(
      like => like.user.toString() === req.user.id
    );

    if (existingLike) {
      // Unlike
      discussion.likes = discussion.likes.filter(
        like => like.user.toString() !== req.user.id
      );
    } else {
      // Like
      discussion.likes.push({ user: req.user.id });
    }

    await discussion.save();

    res.json({
      success: true,
      message: existingLike ? 'Discussion unliked' : 'Discussion liked',
      likeCount: discussion.likes.length,
      isLiked: !existingLike
    });
  } catch (error) {
    console.error('Like discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add reply to discussion
// @route   POST /api/discussions/:id/replies
// @access  Private
router.post('/:id/replies', protect, [
  body('content')
    .trim()
    .isLength({ min: 5, max: 5000 })
    .withMessage('Reply content must be between 5 and 5000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    if (discussion.isLocked) {
      return res.status(403).json({
        success: false,
        message: 'Discussion is locked'
      });
    }

    const reply = await Reply.create({
      content: req.body.content,
      author: req.user.id,
      discussion: req.params.id,
      parentReply: req.body.parentReply || null
    });

    await reply.populate('author', 'username avatar reputation badges');

    // Update discussion
    discussion.replies.push(reply._id);
    discussion.lastReply = reply._id;
    discussion.lastActivity = new Date();
    await discussion.save();

    // Update user stats
    await req.user.updateOne({ $inc: { 'stats.repliesCount': 1 } });

    res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      data: reply
    });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Pin/Unpin discussion (Admin/Moderator only)
// @route   PATCH /api/discussions/:id/pin
// @access  Private (Admin/Moderator)
router.patch('/:id/pin', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    discussion.isPinned = !discussion.isPinned;
    await discussion.save();

    res.json({
      success: true,
      message: `Discussion ${discussion.isPinned ? 'pinned' : 'unpinned'} successfully`,
      isPinned: discussion.isPinned
    });
  } catch (error) {
    console.error('Pin discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Lock/Unlock discussion (Admin/Moderator only)
// @route   PATCH /api/discussions/:id/lock
// @access  Private (Admin/Moderator)
router.patch('/:id/lock', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }

    discussion.isLocked = !discussion.isLocked;
    await discussion.save();

    res.json({
      success: true,
      message: `Discussion ${discussion.isLocked ? 'locked' : 'unlocked'} successfully`,
      isLocked: discussion.isLocked
    });
  } catch (error) {
    console.error('Lock discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;