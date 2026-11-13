const express = require("express");
const requireAuth = require("../middleware/auth.middleware");
const { deleteCrop, getCrop, updateCrop } = require("../controllers/crop.controller");

const router = express.Router();

router.use(requireAuth);
router.get("/:id", getCrop);
router.put("/:id", updateCrop);
router.delete("/:id", deleteCrop);

module.exports = router;
