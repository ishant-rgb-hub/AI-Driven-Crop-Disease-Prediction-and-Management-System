const express = require("express");
const { getDiseases, getDiseaseById } = require("../controllers/disease.controller");

const router = express.Router();

router.get("/", getDiseases);
router.get("/:id", getDiseaseById);

module.exports = router;
