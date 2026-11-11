
const express = require("express");
const app = express();

const treatmentRoutes = require("./routes/treatment.routes");
const diseaseRoutes = require("./routes/disease.routes");
const authRoutes = require("./routes/auth.routes");
const errorMiddleware = require("./middleware/error.middleware");

app.use(express.json({ limit: "100kb" }));

// Treatment API
app.use("/api/treatments", treatmentRoutes);

// Disease API (Member B)
app.use("/api/diseases", diseaseRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Crop Disease Management Backend is running!"
    });
});

app.use(errorMiddleware);

module.exports = app;
