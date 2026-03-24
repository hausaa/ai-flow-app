require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const flowRoutes = require("./routes/flowRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Connect to Database ──────────────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api", flowRoutes);

// ─── Start ────────────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
