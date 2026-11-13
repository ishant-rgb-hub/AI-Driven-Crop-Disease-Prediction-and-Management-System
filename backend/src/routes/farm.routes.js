const express = require("express");
const requireAuth = require("../middleware/auth.middleware");
const { createCrop, listFarmCrops } = require("../controllers/crop.controller");
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
router.post("/", createFarm);
router.get("/", listFarms);
router.get("/:id", getFarm);
router.put("/:id", updateFarm);
router.delete("/:id", deleteFarm);

module.exports = router;
