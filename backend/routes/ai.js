const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();

// Initialize Gemini
// Note: It's good practice to fail gracefully if the key is missing, 
// for now we'll assume it's there or handle the error in the request.
const getGenAI = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

router.post("/chat", async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        let chatHistory = [];
        if (history && Array.isArray(history)) {
            chatHistory = history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));
        }

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        if (error.message.includes("GEMINI_API_KEY")) {
            return res.status(500).json({ error: "Server configuration error: API Key missing." });
        }
        res.status(500).json({ error: "Failed to get response from AI." });
    }
});

module.exports = router;
