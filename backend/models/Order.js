const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  totalAmount: { type: Number, required: true },
  items: [{
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  paymentMethod: { type: String, default: 'upi' },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered'], 
    default: 'confirmed' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
