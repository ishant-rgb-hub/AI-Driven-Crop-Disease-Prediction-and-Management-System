const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.get("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) return res.status(401).json({ error: "Authentication required" });
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    const error = new Error("JWT_SECRET is not configured");
    error.status = 500;
    return next(error);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    if (!payload || typeof payload !== "object" || typeof payload.sub !== "string") {
      return res.status(401).json({ error: "Invalid token" });
    }
    const userId = Number(payload.sub);
    if (!Number.isInteger(userId) || userId < 1) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = { id: userId };
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};
