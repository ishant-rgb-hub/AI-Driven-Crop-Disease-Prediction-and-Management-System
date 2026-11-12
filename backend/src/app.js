
const express = require("express");
const app = express();

const treatmentRoutes = require("./routes/treatment.routes");
const diseaseRoutes = require("./routes/disease.routes");
const errorMiddleware = require("./middleware/error.middleware");

app.use(express.json());


app.use("/api/treatments", treatmentRoutes);


app.use("/api/diseases", diseaseRoutes);


app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Crop Disease Management Backend is running!"
    });
});

app.use(errorMiddleware);

module.exports = app;
