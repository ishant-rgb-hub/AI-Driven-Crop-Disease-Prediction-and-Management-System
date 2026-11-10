
const express = require("express");
const app = express();

const treatmentRoutes = require("./routes/treatment.routes");

app.use(express.json());

// Treatment API
app.use("/api/treatments", treatmentRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Crop Disease Management Backend is running!"
    });
});

module.exports = app;
