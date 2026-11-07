
const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Homepage API
app.get("/", (req, res) => {
    res.send("Crop Disease Management Backend is Running!");
});

// Health check API
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Member C Disease Management API is working!"
    });
});

// Export the application
module.exports = app;
