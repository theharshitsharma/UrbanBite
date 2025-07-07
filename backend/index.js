const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./db");

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:10000",
  
  "https://urbanbite-4ewi.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  
  credentials: true
}));
// For COOP and CORP compatibility
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(express.json());

app.use("/api", require("./Routes/CreateUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/OrderData"));
app.use("/api", require("./Routes/Profile"));
app.use('/api', require('./Routes/Auth'));

app.use("/api", require("./Routes/Otp"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });
