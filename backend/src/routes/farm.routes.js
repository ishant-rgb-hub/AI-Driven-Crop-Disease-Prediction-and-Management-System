const express = require("express");
const requireAuth = require("../middleware/auth.middleware");
const { createCrop, listFarmCrops } = require("../controllers/crop.controller");
const { createField, listFarmFields } = require("../controllers/field.controller");
const {
  createFarm,
  deleteFarm,
  getFarm,
  listFarms,
  updateFarm,
} = require("../controllers/farm.controller");

const router = express.Router();

router.use(requireAuth);
router.post("/:farmId/crops", createCrop);
router.get("/:farmId/crops", listFarmCrops);
router.post("/:farmId/fields", createField);
router.get("/:farmId/fields", listFarmFields);
router.post("/", createFarm);
router.get("/", listFarms);
router.get("/:id", getFarm);
router.put("/:id", updateFarm);
router.delete("/:id", deleteFarm);

module.exports = router;
