const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  order_data: [
    {
      order_date: {
        type: Date,         // ✅ Correct type for storing date+time
        default: Date.now   // Optional: fallback if not provided
      },
      items: {
        type: Array,
        required: true
      },
      paymentId: {
  type: String,
  required: true
}
      
    }
  ]
});

module.exports = mongoose.model('order', OrderSchema);
