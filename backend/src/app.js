
require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const treatmentRoutes = require("./routes/treatment.routes");
const diseaseRoutes = require("./routes/disease.routes");
const imageRoutes = require("./routes/image.routes");
const predictionRoutes = require("./routes/prediction.routes");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const farmRoutes = require("./routes/farm.routes");
const preventionRoutes = require("./routes/prevention.routes");


const recommendationRoutes =
  require("./routes/recommendation.routes");

const feedbackRoutes =
  require("./routes/feedback.routes");
const errorMiddleware = require("./middleware/error.middleware");

app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
}));


app.use("/api/treatments", treatmentRoutes);


app.use("/api/diseases", diseaseRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/users", profileRoutes);
app.use("/api/farms", farmRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/feedback", feedbackRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Crop Disease Management Backend is running!"
    });
});

app.use(errorMiddleware);

module.exports = app;
