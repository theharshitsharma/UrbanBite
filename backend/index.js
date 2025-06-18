const express = require("express");
const app = express();
const port = 5000;
const connectDB = require("./db");
const cors = require("cors");

// ✅ Middlewares — always put these before routes
app.use(cors({
  origin: "http://localhost:3000",
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
app.use("/api", require("./Routes/Otp")); // move this after middleware

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
