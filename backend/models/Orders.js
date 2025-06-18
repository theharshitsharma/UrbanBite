const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  order_data: [
    {
      order_date: String,
      items: Array
    }
  ]
});

module.exports = mongoose.model('order', OrderSchema);
