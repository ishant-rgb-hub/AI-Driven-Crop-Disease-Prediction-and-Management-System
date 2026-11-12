const express = require("express");
const requireAuth = require("../middleware/auth.middleware");
const { getProfile, updateProfile } = require("../controllers/profile.controller");

const router = express.Router();

router.use(requireAuth);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

module.exports = router;
