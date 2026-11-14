const express = require("express");
const router = express.Router();

const {
  createPrevention,
  getAllPreventions,
  getPreventionById,
  getPreventionsByDisease,
  updatePrevention,
  deletePrevention
} = require("../controllers/prevention.controller");

router.post("/", createPrevention);
router.get("/", getAllPreventions);
router.get("/disease/:diseaseId", getPreventionsByDisease);
router.get("/:id", getPreventionById);
router.put("/:id", updatePrevention);
router.delete("/:id", deletePrevention);

module.exports = router;