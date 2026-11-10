
const express = require("express");
const router = express.Router();

const {
    getTreatments,
    getTreatmentById
} = require("../controllers/treatment.controller");

router.get("/", getTreatments);
router.get("/:id", getTreatmentById);

module.exports = router;
