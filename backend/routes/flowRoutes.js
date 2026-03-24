const express = require("express");
const router = express.Router();
const {
  healthCheck,
  askAI,
  saveFlow,
  getFlows,
} = require("../controllers/flowController");

// Health check
router.get("/health", healthCheck);

// Ask AI via OpenRouter
router.post("/ask-ai", askAI);

// Save flow to MongoDB
router.post("/save-flow", saveFlow);

// Get all saved flows
router.get("/flows", getFlows);

module.exports = router;