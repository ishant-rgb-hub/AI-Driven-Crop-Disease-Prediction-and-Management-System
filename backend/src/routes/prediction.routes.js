const express = require("express");
const requireAuth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const {
  createPrediction,
  listPredictions,
  getPrediction,
} = require("../controllers/prediction.controller");

const router = express.Router();

router.use(requireAuth);
router.post("/", upload, createPrediction);
router.get("/", listPredictions);
router.get("/:id", getPrediction);

module.exports = router;
