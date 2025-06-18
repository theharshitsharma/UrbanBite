// routes/foodData.js
const express = require("express");
const router = express.Router();

// POST /api/foodData
router.post("/foodData", (_req, res) => {
  try {
    res.json([
      global.food_items || [],
      global.food_categories || []
    ]);
  } catch (error) {
    console.error("Error in /foodData:", error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
