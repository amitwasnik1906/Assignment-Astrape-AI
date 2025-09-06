const express = require('express');
const Item = require('../models/Item');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all items with filters
// @route   GET /api/items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort = '-createdAt' } = req.query;
    
    // Build query
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Item.find(query).sort(sort);
    
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Create new item
// @route   POST /api/items
// @access  Private (Admin only - simplified for this example)
router.post('/', protect, async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private (Admin only - simplified for this example)
router.put('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private (Admin only - simplified for this example)
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;