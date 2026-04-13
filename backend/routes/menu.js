const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');  // Create this model next if missing

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add more routes as needed (POST for adding items, etc.)
module.exports = router;
