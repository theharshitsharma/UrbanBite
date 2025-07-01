const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

router.post('/orderData', async (req, res) => {
  const { email, order } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const orderEntry = {
    order_date: new Date().toDateString(),
    items: order.items
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

    return res.json({ success: true });
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).send("Server Error: " + error.message);
  }
});
router.post('/myorderData', async (req, res) => {
  try {
    const myData = await Order.findOne({ email: req.body.email });

    if (!myData) {
      return res.status(404).json({ orderData: [] }); // return empty if not found
    }

    res.json({ orderData: myData.order_data });
  } catch (error) {
    res.status(500).send("Server Error: " + error.message);
  }
});
router.delete('/deleteOrder', async (req, res) => {
  const { email, orderGroupId } = req.body;

  try {
    const userOrder = await Order.findOne({ email });
    if (!userOrder) {
      return res.status(404).json({ success: false, error: 'User order not found' });
    }

    const originalLength = userOrder.order_data.length;

    // Filter out the group by its unique _id
    userOrder.order_data = userOrder.order_data.filter(
      group => group._id.toString() !== orderGroupId
    );

    if (userOrder.order_data.length === originalLength) {
      return res.status(400).json({ success: false, error: 'Order group not found' });
    }

    await userOrder.save();
    return res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.delete('/deleteItemFromData', async (req, res) => {
  const { email, orderDate, name, size } = req.body;

  try {
    const userOrder = await Order.findOne({ email });

    if (!userOrder) return res.status(404).json({ success: false, error: 'User order not found' });

    let updated = false;

    userOrder.order_data.forEach((group) => {
      if (group.order_date === orderDate) {
        const originalLength = group.items.length;
        group.items = group.items.filter(item => !(item.name === name && item.size === size));
        if (group.items.length !== originalLength) updated = true;
      }
    });

    if (!updated) return res.status(400).json({ success: false, error: 'Item not found' });

    // Remove empty order groups (optional)
    userOrder.order_data = userOrder.order_data.filter(group => group.items.length > 0);

    await userOrder.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


module.exports = router;
