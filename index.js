const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

// Sample API Route
app.get("/", (req, res) => {
    res.send("Welcome to Travel API!");
});

const blogRoutes = require("./routes/blogRoutes");
app.use("/api/blogs", blogRoutes);

const mongoose = require("mongoose");

mongoose.connect(MONGO_URI);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



