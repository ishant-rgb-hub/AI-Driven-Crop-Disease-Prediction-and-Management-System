const express = require("express");
const upload = require("../middleware/upload.middleware");
const requireAuth = require("../middleware/auth.middleware");
const { uploadImage } = require("../controllers/image.controller");

const router = express.Router();

router.post("/", requireAuth, upload, uploadImage);

module.exports = router;
