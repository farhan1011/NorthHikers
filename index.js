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
const userRoutes = require("./routes/userRoutes");

app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);

const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI; // Load from .env

if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined. Check your .env file.");
  process.exit(1); // Exit if no MongoDB URI
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("MongoDB Connection Error:", err));
  
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



