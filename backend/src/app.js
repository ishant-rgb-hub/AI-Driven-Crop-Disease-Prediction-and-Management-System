
const express = require("express");
const app = express();

const treatmentRoutes = require("./routes/treatment.routes");
const diseaseRoutes = require("./routes/disease.routes");
const errorMiddleware = require("./middleware/error.middleware");

app.use(express.json());

// Treatment API
app.use("/api/treatments", treatmentRoutes);

// Disease API (Member B)
app.use("/api/diseases", diseaseRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Crop Disease Management Backend is running!"
    });
});

app.use(errorMiddleware);

module.exports = app;
