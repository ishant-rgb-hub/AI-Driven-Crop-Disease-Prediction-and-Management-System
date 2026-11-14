
const express = require("express");
const router = express.Router();

const {
  createRecommendation,
  getAllRecommendations,
  getRecommendationById,
  getRecommendationsByPrediction,
  updateRecommendation,
  deleteRecommendation
} = require("../controllers/recommendation.controller");

router.post("/", createRecommendation);
router.get("/", getAllRecommendations);
router.get("/prediction/:predictionId", getRecommendationsByPrediction);
router.get("/:id", getRecommendationById);
router.put("/:id", updateRecommendation);
router.delete("/:id", deleteRecommendation);

module.exports = router;
