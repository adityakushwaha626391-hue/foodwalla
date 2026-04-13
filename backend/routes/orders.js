const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

// 🔥 Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Order Schema
const orderSchema = new mongoose.Schema({
  orderId: String,
  razorpayOrderId: String,      // 🔥 NEW
  razorpayPaymentId: String,    // 🔥 NEW
  razorpaySignature: String,    // 🔥 NEW
  items: Array,
  totalAmount: Number,
  paymentMethod: String,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// 🔥 1. CREATE RAZORPAY ORDER (Frontend call karega)
router.post('/create', async (req, res) => {
  try {
    const { amount } = req.body; // Paise mein aayega (₹350 = 35000)
    
    const razorpayOrder = await razorpay.orders.create({
      amount: amount,        // Paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        type: 'food_order'
      }
    });

    res.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      status: razorpayOrder.status
    });
  } catch (error) {
    console.error('❌ Razorpay order error:', error);
    res.status(500).json({ error: 'Order creation failed' });
  }
});

// 🔥 2. VERIFY PAYMENT (Payment success ke baad)
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Signature verify karo
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment successful - MongoDB save
      const newOrder = new Order({
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        orderId: `FW${Date.now().toString().slice(-6)}`,
        items: [], // Frontend se aayega later
        totalAmount: parseInt(req.body.amount) / 100, // Rupees mein
        paymentMethod: 'razorpay',
        status: 'confirmed'
      });
      
      await newOrder.save();
      
      res.json({ 
        success: true, 
        message: 'Payment verified & order saved!',
        orderId: newOrder.orderId 
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('❌ Verify error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// 🔥 3. SAVE FRONTEND ORDER (Tera existing code)
router.post('/', async (req, res) => {
  try {
    const { orderId, items, totalAmount, paymentMethod, status } = req.body;
    const order = new Order({ 
      orderId, 
      items, 
      totalAmount, 
      paymentMethod, 
      status 
    });
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Order creation failed' });
  }
});

// 🔥 4. GET ALL ORDERS (Admin dashboard ke liye)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50);
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ orders: [] });
  }
});

// 🔥 5. GET SINGLE ORDER
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ order: null });
  }
});

module.exports = router;
