const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Google Gemini AI API URL
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Smart Packing List Generator API
router.post("/", async (req, res) => {
    try {
        const { destination, travelDuration, season, activities, personalPreferences } = req.body;

        if (!destination || !travelDuration || !season) {
            return res.status(400).json({ message: "Missing required fields: destination, travelDuration, season" });
        }

        const prompt = `I am traveling to ${destination} for ${travelDuration} days during ${season}. 
        My activities include: ${activities}. My personal preferences are: ${personalPreferences}.
        Generate a detailed and categorized packing list for me, including clothes, essentials, and travel safety precautions.`;

        const requestBody = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ]
        };

        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, requestBody, {
            headers: { "Content-Type": "application/json" }
        });

        if (response.data && response.data.candidates?.length > 0) {
            const packingList = response.data.candidates[0].content.parts[0].text;
            return res.status(200).json({ message: "Packing list generated successfully", packingList });
        } else {
            return res.status(500).json({ message: "Failed to generate packing list, empty response" });
        }
    } catch (error) {
        console.error("Packing List Error:", error.response?.data || error.message);
        res.status(500).json({ message: "Failed to generate packing list", error: error.response?.data || error.message });
    }
});

module.exports = router;
