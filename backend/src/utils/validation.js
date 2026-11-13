const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function validateUserFields(body, { partial = false } = {}) {
  if (!isPlainObject(body)) return "Request body must be an object";

  if (!partial || body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length < 2 || body.name.trim().length > 100) {
      return "Name must be between 2 and 100 characters";
    }
  }

  if (!partial || body.email !== undefined) {
    const email = normalizeEmail(body.email);
    if (!EMAIL_PATTERN.test(email) || email.length > 254) return "A valid email is required";
  }

  if (!partial || body.password !== undefined) {
    if (typeof body.password !== "string" || body.password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (Buffer.byteLength(body.password, "utf8") > 72) {
      return "Password must not exceed 72 bytes";
    }
  }

  if (body.phone !== undefined && body.phone !== null) {
    if (typeof body.phone !== "string" || !/^[0-9+()\-\s]{7,20}$/.test(body.phone.trim())) {
      return "Phone must be a valid phone number";
    }
  }

  return null;
}

function validateFarmFields(body, { partial = false } = {}) {
  if (!isPlainObject(body)) return "Request body must be an object";

  const requiredStrings = [
    ["farmName", "Farm name", 2, 100],
    ["location", "Location", 2, 200],
    ["soilType", "Soil type", 2, 100],
    ["irrigationType", "Irrigation type", 2, 100],
  ];

  for (const [field, label, min, max] of requiredStrings) {
    if (partial && body[field] === undefined) continue;
    if (typeof body[field] !== "string" || body[field].trim().length < min || body[field].trim().length > max) {
      return `${label} must be between ${min} and ${max} characters`;
    }
  }

  if (!partial || body.totalArea !== undefined) {
    const area = typeof body.totalArea === "string" ? Number(body.totalArea) : body.totalArea;
    if (typeof area !== "number" || !Number.isFinite(area) || area <= 0) {
      return "Total area must be a positive number";
    }
  }

  return null;
}

function validateCropFields(body, { partial = false } = {}) {
  if (!isPlainObject(body)) return "Request body must be an object";

  const allowedFields = new Set([
    "cropName",
    "cropVariety",
    "plantingDate",
    "expectedHarvestDate",
    "growthStage",
  ]);
  if (Object.keys(body).some((field) => !allowedFields.has(field))) {
    return "Request body contains unsupported crop fields";
  }

  if (!partial || body.cropName !== undefined) {
    if (typeof body.cropName !== "string" || body.cropName.trim().length < 2 || body.cropName.trim().length > 100) {
      return "Crop name must be between 2 and 100 characters";
    }
  }

  for (const [field, label, maxLength] of [
    ["cropVariety", "Crop variety", 100],
    ["growthStage", "Growth stage", 50],
  ]) {
    if (body[field] === undefined || body[field] === null) continue;
    if (typeof body[field] !== "string" || body[field].trim().length < 1 || body[field].trim().length > maxLength) {
      return `${label} must be between 1 and ${maxLength} characters`;
    }
  }

  for (const [field, label] of [
    ["plantingDate", "Planting date"],
    ["expectedHarvestDate", "Expected harvest date"],
  ]) {
    if (body[field] === undefined || body[field] === null) continue;
    if (typeof body[field] !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(body[field])) {
      return `${label} must be a valid date in YYYY-MM-DD format`;
    }
    const date = new Date(`${body[field]}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== body[field]) {
      return `${label} must be a valid date in YYYY-MM-DD format`;
    }
  }

  return null;
}

function validateFieldFields(body, { partial = false } = {}) {
  if (!isPlainObject(body)) return "Request body must be an object";

  const allowedFields = new Set(["fieldName", "area", "soilType", "irrigationType"]);
  if (Object.keys(body).some((field) => !allowedFields.has(field))) {
    return "Request body contains unsupported field properties";
  }

  if (!partial || body.fieldName !== undefined) {
    if (typeof body.fieldName !== "string" || body.fieldName.trim().length < 2 || body.fieldName.trim().length > 100) {
      return "Field name must be between 2 and 100 characters";
    }
  }

  if (!partial || body.area !== undefined) {
    const area = typeof body.area === "string" ? Number(body.area) : body.area;
    if (typeof area !== "number" || !Number.isFinite(area) || area <= 0) {
      return "Field area must be a positive number";
    }
  }

  for (const [field, label] of [
    ["soilType", "Soil type"],
    ["irrigationType", "Irrigation type"],
  ]) {
    if (body[field] === undefined || body[field] === null) continue;
    if (typeof body[field] !== "string" || body[field].trim().length < 2 || body[field].trim().length > 100) {
      return `${label} must be between 2 and 100 characters`;
    }
  }

  return null;
}

function safeUser(user) {
  if (!user) return null;
  const { id, name, email, phone, createdAt, updatedAt } = user;
  return { id, name, email, phone, createdAt, updatedAt };
}

module.exports = {
  isPlainObject,
  normalizeEmail,
  safeUser,
  validateCropFields,
  validateFieldFields,
  validateFarmFields,
  validateUserFields,
};
