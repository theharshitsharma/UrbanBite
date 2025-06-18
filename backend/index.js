const express = require("express");
const app = express();
const connectDB = require("./db");
const cors = require("cors");

// ✅ Use Render-provided port or fallback to 5000 for local development
const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(cors({
  origin: "http://localhost:3000", // change to frontend URL when deploying
  credentials: true
}));
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ API Routes
app.use("/api", require("./Routes/CreateUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/OrderData"));
app.use("/api", require("./Routes/Profile"));
app.use("/api", require("./Routes/Otp"));

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
