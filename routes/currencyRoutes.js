const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Currency Exchange API (Using Gemini AI)
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post("/convert", async (req, res) => {
    try {
        const { amount, fromCurrency, toCurrency } = req.body;

        if (!amount || !fromCurrency || !toCurrency) {
            return res.status(400).json({ message: "Missing required fields: amount, fromCurrency, toCurrency" });
        }

        const requestBody = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: `Convert ${amount} ${fromCurrency} to ${toCurrency} using real-time exchange rates.` }]
                }
            ]
        };

        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, requestBody, {
            headers: { "Content-Type": "application/json" }
        });

        if (response.data && response.data.candidates?.length > 0) {
            const conversionResult = response.data.candidates[0].content.parts[0].text;
            return res.status(200).json({ message: "Currency conversion successful", conversionResult });
        } else {
            return res.status(500).json({ message: "Failed to convert currency, empty response" });
        }
    } catch (error) {
        console.error("Currency Conversion Error:", error.response?.data || error.message);
        res.status(500).json({ message: "Currency conversion failed", error: error.response?.data || error.message });
    }
});

module.exports = router;
