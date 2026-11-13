const prisma = require("../config/database");
const { validateFieldFields } = require("../utils/validation");

const fieldSelect = {
  id: true,
  fieldName: true,
  area: true,
  soilType: true,
  irrigationType: true,
  farmId: true,
  createdAt: true,
  updatedAt: true,
};

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function fieldData(body) {
  return {
    ...(body.fieldName !== undefined ? { fieldName: body.fieldName.trim() } : {}),
    ...(body.area !== undefined ? { area: Number(body.area) } : {}),
    ...(body.soilType !== undefined
      ? { soilType: body.soilType === null ? null : body.soilType.trim() }
      : {}),
    ...(body.irrigationType !== undefined
      ? { irrigationType: body.irrigationType === null ? null : body.irrigationType.trim() }
      : {}),
  };
}

async function findOwnedFarm(farmId, userId) {
  return prisma.farm.findFirst({
    where: { id: farmId, userId },
    select: { id: true },
  });
}

async function createField(req, res, next) {
  const farmId = parseId(req.params.farmId);
  if (!farmId) return res.status(400).json({ success: false, error: "Invalid farm id" });
  const validationError = validateFieldFields(req.body);
  if (validationError) return res.status(400).json({ success: false, error: validationError });

  try {
    const farm = await findOwnedFarm(farmId, req.user.id);
    if (!farm) return res.status(404).json({ success: false, error: "Farm not found" });
    const field = await prisma.field.create({
      data: { ...fieldData(req.body), farmId },
      select: fieldSelect,
    });
    return res.status(201).json({ success: true, field });
  } catch (error) {
    return next(error);
  }
}

async function listFarmFields(req, res, next) {
  const farmId = parseId(req.params.farmId);
  if (!farmId) return res.status(400).json({ success: false, error: "Invalid farm id" });

  try {
    const farm = await findOwnedFarm(farmId, req.user.id);
    if (!farm) return res.status(404).json({ success: false, error: "Farm not found" });
    const fields = await prisma.field.findMany({
      where: { farmId },
      select: fieldSelect,
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, fields });
  } catch (error) {
    return next(error);
  }
}

async function getField(req, res, next) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ success: false, error: "Invalid field id" });

  try {
    const field = await prisma.field.findFirst({
      where: { id, farm: { is: { userId: req.user.id } } },
      select: fieldSelect,
    });
    if (!field) return res.status(404).json({ success: false, error: "Field not found" });
    return res.json({ success: true, field });
  } catch (error) {
    return next(error);
  }
}

async function updateField(req, res, next) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ success: false, error: "Invalid field id" });
  const validationError = validateFieldFields(req.body, { partial: true });
  if (validationError) return res.status(400).json({ success: false, error: validationError });
  if (!Object.keys(req.body || {}).length) {
    return res.status(400).json({ success: false, error: "At least one field property is required" });
  }

  try {
    const existing = await prisma.field.findFirst({
      where: { id, farm: { is: { userId: req.user.id } } },
      select: { id: true },
    });
    if (!existing) return res.status(404).json({ success: false, error: "Field not found" });
    const field = await prisma.field.update({
      where: { id },
      data: fieldData(req.body),
      select: fieldSelect,
    });
    return res.json({ success: true, field });
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ success: false, error: "Field not found" });
    return next(error);
  }
}

async function deleteField(req, res, next) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ success: false, error: "Invalid field id" });

  try {
    const existing = await prisma.field.findFirst({
      where: { id, farm: { is: { userId: req.user.id } } },
      select: { id: true },
    });
    if (!existing) return res.status(404).json({ success: false, error: "Field not found" });
    await prisma.field.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ success: false, error: "Field not found" });
    return next(error);
  }
}

module.exports = { createField, deleteField, getField, listFarmFields, updateField };
