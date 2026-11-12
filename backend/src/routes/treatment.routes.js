
const express = require("express");

const router = express.Router();

const {
  getAllTreatments,
  getTreatmentById,
  getTreatmentsByDisease
} = require("../controllers/treatment.controller");


router.get("/", getAllTreatments);


router.get("/:id", getTreatmentById);


router.get("/disease/:diseaseId", getTreatmentsByDisease);

module.exports = router;
