const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Google Gemini API URL for translation
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// AI Translation Chatbot API
router.post("/", async (req, res) => {
    try {
        const { text, fromLanguage, toLanguage } = req.body;

        if (!text || !toLanguage) {
            return res.status(400).json({ message: "Missing required fields: text and toLanguage" });
        }

        // Default 'fromLanguage' to English if not provided
        const sourceLang = fromLanguage || "English";

        const requestBody = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: `Translate this text from ${sourceLang} to ${toLanguage}: "${text}"` }]
                }
            ]
        };

        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, requestBody, {
            headers: { "Content-Type": "application/json" }
        });

        if (response.data && response.data.candidates?.length > 0) {
            const translatedText = response.data.candidates[0].content.parts[0].text;
            return res.status(200).json({ message: "Translation successful", translatedText });
        } else {
            return res.status(500).json({ message: "Failed to translate, empty response" });
        }
    } catch (error) {
        console.error("Translation Error:", error.response?.data || error.message);
        res.status(500).json({ message: "Translation failed", error: error.response?.data || error.message });
    }
});

module.exports = router;
