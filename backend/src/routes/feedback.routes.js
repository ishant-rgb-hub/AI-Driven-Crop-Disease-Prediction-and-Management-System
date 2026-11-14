
const express = require("express");
const router = express.Router();

const {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback
} = require("../controllers/feedback.controller");

router.post("/", createFeedback);
router.get("/", getAllFeedback);
router.get("/:id", getFeedbackById);
router.put("/:id", updateFeedback);
router.delete("/:id", deleteFeedback);

module.exports = router;
