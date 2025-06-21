const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const auth = require('../middleware/auth');

// @route   GET /api/blog
// @desc    Get all blog posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;

    let query = { status: 'published' };

    if (category) {
      query.category = category;
    }

    const posts = await BlogPost.find(query)
      .populate('author', 'username firstName lastName')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BlogPost.countDocuments(query);

    res.json({
      posts,
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

// @route   POST /api/blog
// @desc    Create a blog post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, status } = req.body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const post = new BlogPost({
      title,
      slug,
      content,
      excerpt,
      category,
      tags,
      author: req.user.id,
      status: status || 'draft'
    });

    if (status === 'published') {
      post.publishedAt = new Date();
    }

    await post.save();
    await post.populate('author', 'username firstName lastName');

    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/blog/:slug
// @desc    Get blog post by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug })
      .populate('author', 'username firstName lastName');

    if (!post) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;