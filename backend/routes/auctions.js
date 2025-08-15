
const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const { auth, authorize } = require('../middleware/auth');
const { cleanupAuctionImages } = require('../lib/imageCleanup');

const router = express.Router();

// Get all auctions with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isIn(['watches', 'art', 'jewelry', 'cars', 'books', 'electronics', 'collectibles', 'other']),
  query('status').optional().isIn(['active', 'scheduled', 'ended']),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'ending_soon', 'newest'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 12,
      category,
      status,
      sort = 'newest',
      search
    } = req.query;

    // Build filter
    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    let sortObj = {};
    switch (sort) {
      case 'price_asc':
        sortObj = { current_price: 1 };
        break;
      case 'price_desc':
        sortObj = { current_price: -1 };
        break;
      case 'ending_soon':
        sortObj = { end_time: 1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const auctions = await Auction.find(filter)
      .populate('seller_id', 'full_name email')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Auction.countDocuments(filter);

    // Update auction statuses
    auctions.forEach(auction => auction.updateStatus());

    res.json({
      auctions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single auction
router.get('/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('seller_id', 'full_name email kyc_status')
      .populate('winner_id', 'full_name');

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Update status
    auction.updateStatus();
    await auction.save();

    // Get recent bids
    const recentBids = await Bid.find({ auction_id: auction._id })
      .populate('bidder_id', 'full_name')
      .sort({ bid_time: -1 })
      .limit(10);

    res.json({
      auction,
      recent_bids: recentBids
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create auction (sellers only)
router.post('/', [
  auth,
  authorize('seller', 'admin'),
  body('title').trim().isLength({ min: 5, max: 200 }),
  body('description').trim().isLength({ min: 10, max: 2000 }),
  body('category').isIn(['watches', 'art', 'jewelry', 'cars', 'books', 'electronics', 'collectibles', 'other']),
  body('starting_price').isFloat({ min: 0 }).custom((value) => {
    if (value < 100) {
      throw new Error('Starting price must be at least ₹100');
    }
    return true;
  }),
  body('bid_increment').isFloat({ min: 1 }),
  body('start_time').isISO8601(),
  body('end_time').isISO8601(),
  body('condition').isIn(['new', 'like_new', 'good', 'fair', 'poor']),
  body('images').optional().isArray().custom((value) => {
    if (value && value.length > 10) {
      throw new Error('Maximum 10 images allowed per auction');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const auctionData = {
      ...req.body,
      seller_id: req.user._id,
      start_time: new Date(req.body.start_time),
      end_time: new Date(req.body.end_time)
    };

    // Validate images structure if provided
    if (auctionData.images && Array.isArray(auctionData.images)) {
      auctionData.images.forEach((img, index) => {
        if (!img.url || !img.public_id) {
          throw new Error(`Image ${index + 1} is missing required fields (url or public_id)`);
        }
      });
    }

    const auction = new Auction(auctionData);
    await auction.save();

    res.status(201).json({
      message: 'Auction created successfully',
      auction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update auction (seller only, before auction starts)
router.put('/:id', [
  auth,
  authorize('seller', 'admin'),
  body('title').optional().trim().isLength({ min: 5, max: 200 }),
  body('description').optional().trim().isLength({ min: 10, max: 2000 }),
  body('starting_price').optional().isFloat({ min: 0 }).custom((value) => {
    if (value && value < 100) {
      throw new Error('Starting price must be at least ₹100');
    }
    return true;
  }),
  body('reserve_price').optional().isFloat({ min: 0 }),
  body('images').optional().isArray().custom((value) => {
    if (value && value.length > 10) {
      throw new Error('Maximum 10 images allowed per auction');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const auction = await Auction.findById(req.params.id);
    
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Check if user owns the auction
    if (auction.seller_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this auction' });
    }

    // Check if auction has started
    if (auction.status === 'active' || auction.status === 'ended') {
      return res.status(400).json({ message: 'Cannot update auction that has started or ended' });
    }

    // Validate images structure if provided
    if (req.body.images && Array.isArray(req.body.images)) {
      req.body.images.forEach((img, index) => {
        if (!img.url || !img.public_id) {
          throw new Error(`Image ${index + 1} is missing required fields (url or public_id)`);
        }
      });
    }

    // Update auction
    Object.assign(auction, req.body);
    await auction.save();

    // Emit Socket.IO event for product updates
    const io = req.app.get('io');
    if (io) {
      io.to(`auction_${auction._id}`).emit('productUpdate', {
        auctionId: auction._id,
        updates: auction,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      message: 'Auction updated successfully',
      auction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete auction (seller only, before auction starts)
router.delete('/:id', [auth, authorize('seller', 'admin')], async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Check if user owns the auction
    if (auction.seller_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this auction' });
    }

    // Check if auction has bids
    const bidCount = await Bid.countDocuments({ auction_id: auction._id });
    if (bidCount > 0) {
      return res.status(400).json({ message: 'Cannot delete auction with existing bids' });
    }

    // Clean up images from Cloudinary before deleting auction
    await cleanupAuctionImages(auction);

    await Auction.findByIdAndDelete(req.params.id);

    res.json({ message: 'Auction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
