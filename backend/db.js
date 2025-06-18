// db.js
const mongoose = require("mongoose");

const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://harshit2004ji:harshit2004Z@cluster0.uxqz6jx.mongodb.net/UrbanBite?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    const db = conn.connection.db;

    // ✅ Match Compass collection names exactly
    const foodItems = await db.collection("food_items").find({}).toArray();
    const foodCategories = await db.collection("foodcategory").find({}).toArray();

    // ✅ Store in global
    global.food_items = foodItems;
    global.food_categories = foodCategories;

    console.log(`Fetched ${foodItems.length} items, ${foodCategories.length} categories`);

    if (foodCategories.length === 0) {
      console.warn("⚠️ No food categories found in 'foodcategory' collection.");
    }
  } catch (err) {
    console.error("❌ MongoDB connection or fetch failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
