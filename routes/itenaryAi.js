const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Google Gemini API URL for gemini-2.0-flash
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Generate Itinerary API
router.post("/generate", async (req, res) => {
    try {
        const { destination, startDate, endDate, preferences } = req.body;

        if (!destination || !startDate || !endDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const requestBody = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: `Create a travel itinerary for ${destination} from ${startDate} to ${endDate}. Consider these preferences: ${preferences}.` }]
                }
            ]
        };

        // Send request to Google Gemini API
        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, requestBody, {
            headers: { "Content-Type": "application/json" }
        });

        // Check if API responded with a valid itinerary
        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            const itinerary = response.data.candidates[0].content.parts[0].text;
            return res.status(200).json({ message: "Itinerary generated successfully", itinerary });
        } else {
            return res.status(500).json({ message: "Failed to generate itinerary, empty response" });
        }
    } catch (error) {
        console.error("Error generating itinerary:", error.response?.data || error.message);
        res.status(500).json({ message: "Failed to generate itinerary", error: error.response?.data || error.message });
    }
});

module.exports = router;
