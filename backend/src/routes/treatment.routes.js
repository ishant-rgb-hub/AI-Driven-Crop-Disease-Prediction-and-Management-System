
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

const express = require("express");

const router = express.Router();

const {
  createTreatment,
  getAllTreatments,
  getTreatmentById,
  getTreatmentsByDisease,
  updateTreatment,
  deleteTreatment
} = require("../controllers/treatment.controller");


router.post("/", createTreatment);


router.get("/", getAllTreatments);


router.get("/disease/:diseaseId", getTreatmentsByDisease);


router.get("/:id", getTreatmentById);


router.put("/:id", updateTreatment);


router.delete("/:id", deleteTreatment);

module.exports = router;


module.exports = router;
