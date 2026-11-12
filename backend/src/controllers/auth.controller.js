const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/database");
const {
  normalizeEmail,
  safeUser,
  validateUserFields,
} = require("../utils/validation");

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    const error = new Error("JWT_SECRET must be configured with at least 32 characters");
    error.status = 500;
    throw error;
  }
  return secret;
}

function createToken(userId) {
  return jwt.sign({ userId }, getJwtSecret(), {
    expiresIn: "1h",
    algorithm: "HS256",
  });
}

async function register(req, res, next) {
  try {
    const validationError = validateUserFields(req.body);
    if (validationError) return res.status(400).json({ success: false, error: validationError });

    const email = normalizeEmail(req.body.email);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ success: false, error: "Email is already registered" });

    const user = await prisma.user.create({
      data: {
        name: req.body.name.trim(),
        email,
        passwordHash: await bcrypt.hash(req.body.password, 12),
        phone: req.body.phone?.trim() || null,
      },
    });

    return res.status(201).json({ success: true, user: safeUser(user) });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ success: false, error: "Email is already registered" });
    }
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!email || typeof req.body?.password !== "string") {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    const valid = user && await bcrypt.compare(req.body.password, user.passwordHash);
    if (!valid) return res.status(401).json({ success: false, error: "Invalid email or password" });

    return res.json({ success: true, token: createToken(user.id), user: safeUser(user) });
  } catch (error) {
    return next(error);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    return res.json({ success: true, user: safeUser(user) });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createToken, getMe, login, register };
