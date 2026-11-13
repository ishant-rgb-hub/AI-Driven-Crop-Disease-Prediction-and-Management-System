const express = require("express");
const requireAuth = require("../middleware/auth.middleware");
const { deleteField, getField, updateField } = require("../controllers/field.controller");

const router = express.Router();

router.use(requireAuth);
router.get("/:id", getField);
router.put("/:id", updateField);
router.delete("/:id", deleteField);

module.exports = router;
