const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

// 📦 Place a New Order
router.post('/orderData', async (req, res) => {
  const { email, order, paymentId } = req.body;

  if (!email || !order || !Array.isArray(order.items)) {
    return res.status(400).json({ error: "Invalid order payload." });
  }

  const orderEntry = {
    order_date: new Date(),     // ✅ Store full date + time
    items: order.items,
    paymentId: paymentId || null // ✅ Optional: store payment ID
  };

  try {
    let existingOrder = await Order.findOne({ email });

    if (!existingOrder) {
      await Order.create({
        email,
        order_data: [orderEntry]
      });
    } else {
      await Order.findOneAndUpdate(
        { email },
        { $push: { order_data: orderEntry } }
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).send("Server Error: " + error.message);
  }
});

// 📥 Fetch All Orders for a User
router.post('/myorderData', async (req, res) => {
  try {
    const { email } = req.body;
    const myData = await Order.findOne({ email });

    if (!myData || myData.order_data.length === 0) {
      return res.status(200).json({ orderData: [] });
    }

    res.json({ orderData: myData.order_data });
  } catch (error) {
    res.status(500).send("Server Error: " + error.message);
  }
});

// 🗑️ Delete an Entire Order Group by ID
router.delete('/deleteOrder', async (req, res) => {
  const { email, orderGroupId } = req.body;

  try {
    const userOrder = await Order.findOne({ email });
    if (!userOrder) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const initialLength = userOrder.order_data.length;

    userOrder.order_data = userOrder.order_data.filter(
      group => group._id.toString() !== orderGroupId
    );

    if (userOrder.order_data.length === initialLength) {
      return res.status(404).json({ success: false, error: 'Order group not found' });
    }

    await userOrder.save();
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Delete Order Error:", err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// 🗑️ Delete a Specific Item from an Order Group
router.delete('/deleteItemFromData', async (req, res) => {
  const { email, orderDate, name, size } = req.body;

  try {
    const userOrder = await Order.findOne({ email });
    if (!userOrder) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    let updated = false;

    userOrder.order_data.forEach(group => {
      const isSameDate = new Date(group.order_date).getTime() === new Date(orderDate).getTime();

      if (isSameDate) {
        const before = group.items.length;
        group.items = group.items.filter(
          item => !(item.name === name && item.size === size)
        );
        if (group.items.length !== before) {
          updated = true;
        }
      }
    });

    // Remove empty order groups
    userOrder.order_data = userOrder.order_data.filter(group => group.items.length > 0);

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    await userOrder.save();
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Delete Item Error:", err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
