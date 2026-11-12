const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const header = req.get("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Authentication required" });
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) return res.status(401).json({ success: false, error: "Authentication required" });

  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    const error = new Error("JWT_SECRET must be configured with at least 32 characters");
    error.status = 500;
    return next(error);
  }

  try {
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
    if (!Number.isInteger(payload.userId) || payload.userId < 1) {
      return res.status(401).json({ success: false, error: "Invalid authentication token" });
    }
    req.user = { id: payload.userId };
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, error: "Authentication token expired" });
    }
    return res.status(401).json({ success: false, error: "Invalid authentication token" });
  }
}

module.exports = requireAuth;
