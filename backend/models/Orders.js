const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: String,
  size: String,
  qty: Number,
  price: Number,
  img: String
});

const orderGroupSchema = new mongoose.Schema({
  order_date: {
    type: Date,
    default: Date.now
  },
  items: {
    type: [orderItemSchema], // ✅ structured array instead of raw Array
    required: true
  },
  paymentId: {
    type: String,
    required: false // 🔁 Set to false if not passed in dev
  }
});

const OrderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  order_data: {
    type: [orderGroupSchema], // ✅ Use schema array
    default: []
  }
});

module.exports = mongoose.model('Order', OrderSchema);
