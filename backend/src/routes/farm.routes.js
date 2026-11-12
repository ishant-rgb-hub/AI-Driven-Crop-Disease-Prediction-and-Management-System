const express = require("express");
const requireAuth = require("../middleware/auth.middleware");
const {
  createFarm,
  deleteFarm,
  getFarm,
  listFarms,
  updateFarm,
} = require("../controllers/farm.controller");

const router = express.Router();

router.use(requireAuth);
router.post("/", createFarm);
router.get("/", listFarms);
router.get("/:id", getFarm);
router.put("/:id", updateFarm);
router.delete("/:id", deleteFarm);

module.exports = router;
