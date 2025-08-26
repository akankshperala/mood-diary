// index.js
require("dotenv").config(); // ✅ Load env variables first

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const entriesRoutes = require("./routes/entries");

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:3000",  // your frontend's address (updated)
  credentials: true                 // allow cookies/auth headers
}));
app.use(express.json());

// ✅ MongoDB connection with better options
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tlsAllowInvalidCertificates: false, // ⚠️ TEMP fix for your SSL error — remove in production
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit if DB connection fails
  });

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/entries", entriesRoutes);

// ✅ Health check route
app.get("/", (req, res) => res.send("🚀 API is running!"));

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
