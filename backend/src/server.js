
const express = require("express");


const app = express();


app.use(express.json());


app.get("/", (req, res) => {
    res.send("Crop Disease Management Backend is Running!");
});


app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Member C Disease Management API is working!"
    });
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
