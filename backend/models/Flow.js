const mongoose = require("mongoose");

const flowSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    model: { type: String, default: "openai/gpt-3.5-turbo" },
  },
  { timestamps: true }
);

const Flow = mongoose.model("Flow", flowSchema);

module.exports = Flow;