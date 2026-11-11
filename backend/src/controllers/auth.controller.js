const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/database");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_BYTES = 72;
const JWT_SECRET_MIN_LENGTH = 32;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < JWT_SECRET_MIN_LENGTH) {
    const error = new Error("JWT_SECRET is not configured");
    error.status = 500;
    throw error;
  }
  return secret;
}

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function safeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function validateRegistration(body) {
  const { name, email, password } = body;
  if (typeof name !== "string" || !name.trim()) return "Name is required";
  if (typeof email !== "string" || !email.trim()) return "Email is required";
  if (!EMAIL_PATTERN.test(normalizeEmail(email))) return "Invalid email";
  if (typeof password !== "string" || !password) return "Password is required";
  if (
    password.length < PASSWORD_MIN_LENGTH ||
    Buffer.byteLength(password, "utf8") > PASSWORD_MAX_BYTES ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password)
  ) {
    return "Password must be 8-72 bytes and include uppercase, lowercase, and a number";
  }
  return null;
}

exports.register = async (req, res, next) => {
  try {
    const validationError = validateRegistration(req.body || {});
    if (validationError) return res.status(400).json({ error: validationError });

    const email = normalizeEmail(req.body.email);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(409).json({ error: "Email is already registered" });

    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const user = await prisma.user.create({
      data: {
        name: req.body.name.trim(),
        email,
        passwordHash,
        phone: typeof req.body.phone === "string" && req.body.phone.trim()
          ? req.body.phone.trim()
          : null,
      },
    });

    return res.status(201).json({ user: safeUser(user) });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email is already registered" });
    }
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;
    if (!EMAIL_PATTERN.test(email) || typeof password !== "string" || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    const passwordMatches = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;
    if (!user || !passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ sub: String(user.id) }, getJwtSecret(), { expiresIn: "1h" });
    return res.json({ token, user: safeUser(user) });
  } catch (error) {
    return next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user: safeUser(user) });
  } catch (error) {
    return next(error);
  }
};

exports._private = { normalizeEmail, safeUser, validateRegistration };
