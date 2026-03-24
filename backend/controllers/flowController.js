const fetch = require("node-fetch");
const Flow = require("../models/Flow");

// Health check
const healthCheck = (req, res) => {
  res.json({ status: "ok", message: "AI Flow API is running" });
};

// Ask AI via OpenRouter
const askAI = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
        "X-Title": "AI Flow App",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
      }),
    });

    if (!openRouterRes.ok) {
      const errText = await openRouterRes.text();
      console.error("OpenRouter error:", errText);
      return res.status(502).json({ error: "AI service error", details: errText });
    }

    const data = await openRouterRes.json();
    const answer =
      data?.choices?.[0]?.message?.content || "No response from AI.";

    res.json({ response: answer });
  } catch (err) {
    console.error("Error calling OpenRouter:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Save flow to MongoDB
const saveFlow = async (req, res) => {
  const { prompt, response } = req.body;

  if (!prompt || !response) {
    return res.status(400).json({ error: "Prompt and response are required" });
  }

  try {
    const flow = new Flow({ prompt, response });
    await flow.save();
    res.json({ success: true, message: "Flow saved!", id: flow._id });
  } catch (err) {
    console.error("Error saving flow:", err);
    res.status(500).json({ error: "Failed to save flow" });
  }
};

// Get all saved flows
const getFlows = async (req, res) => {
  try {
    const flows = await Flow.find().sort({ createdAt: -1 }).limit(20);
    res.json(flows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch flows" });
  }
};

module.exports = {
  healthCheck,
  askAI,
  saveFlow,
  getFlows,
};