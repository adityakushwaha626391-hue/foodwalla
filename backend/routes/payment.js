const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: 'rzp_live_RzJ9XZ7rDKGGSG',     // Tumhari Key ID
  key_secret: 'G4ZVs8tpLXh75Yfyd5uwDWIl' // Tumhara Secret Key
});

// Order create karne ke liye
router.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount * 100, // Paise me convert (₹500 = 50000)
    currency: "INR",
    receipt: `rcpt_${Date.now()}`
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
