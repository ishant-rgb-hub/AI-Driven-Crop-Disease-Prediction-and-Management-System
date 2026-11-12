const prisma = require("../config/database");
const { safeUser, validateUserFields } = require("../utils/validation");

const protectedFields = new Set(["id", "email", "password", "passwordHash", "createdAt", "updatedAt"]);

async function getProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    return res.json({ success: true, user: safeUser(user) });
  } catch (error) {
    return next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    if (Object.keys(req.body || {}).some((field) => protectedFields.has(field))) {
      return res.status(400).json({ success: false, error: "Protected profile fields cannot be changed" });
    }
    const allowed = ["name", "phone"];
    if (Object.keys(req.body || {}).some((field) => !allowed.includes(field))) {
      return res.status(400).json({ success: false, error: "Only name and phone may be updated" });
    }
    const validationError = validateUserFields(req.body, { partial: true });
    if (validationError) return res.status(400).json({ success: false, error: validationError });
    if (!Object.keys(req.body || {}).length) {
      return res.status(400).json({ success: false, error: "At least one profile field is required" });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(req.body.name !== undefined ? { name: req.body.name.trim() } : {}),
        ...(req.body.phone !== undefined ? { phone: req.body.phone?.trim() || null } : {}),
      },
    });
    return res.json({ success: true, user: safeUser(user) });
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ success: false, error: "User not found" });
    return next(error);
  }
}

module.exports = { getProfile, updateProfile };
