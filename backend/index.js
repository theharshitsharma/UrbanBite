const express = require("express");
const app = express();
const connectDB = require("./db");
const cors = require("cors");

// ✅ Use Render-provided port or fallback to 5000 for local development
const PORT = process.env.PORT || 5000;

// ✅ Allowed CORS origins
const allowedOrigins = [
  "http://localhost:3000",                          // local development
  "https://urbanbite-frontend.onrender.com"         // deployed frontend (replace if needed)
];

// ✅ Middlewares
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

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

// ✅ Start server only after DB connects
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1); // exit with failure
  });
