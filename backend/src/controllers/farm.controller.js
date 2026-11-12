const prisma = require("../config/database");
const { validateFarmFields } = require("../utils/validation");

const farmSelect = {
  id: true,
  farmName: true,
  location: true,
  totalArea: true,
  soilType: true,
  irrigationType: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
};

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function farmData(body) {
  return {
    ...(body.farmName !== undefined ? { farmName: body.farmName.trim() } : {}),
    ...(body.location !== undefined ? { location: body.location.trim() } : {}),
    ...(body.totalArea !== undefined ? { totalArea: Number(body.totalArea) } : {}),
    ...(body.soilType !== undefined ? { soilType: body.soilType.trim() } : {}),
    ...(body.irrigationType !== undefined ? { irrigationType: body.irrigationType.trim() } : {}),
  };
}

async function createFarm(req, res, next) {
  try {
    const validationError = validateFarmFields(req.body);
    if (validationError) return res.status(400).json({ success: false, error: validationError });
    const farm = await prisma.farm.create({
      data: { ...farmData(req.body), userId: req.user.id },
      select: farmSelect,
    });
    return res.status(201).json({ success: true, farm });
  } catch (error) {
    return next(error);
  }
}

async function listFarms(req, res, next) {
  try {
    const farms = await prisma.farm.findMany({
      where: { userId: req.user.id },
      select: farmSelect,
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, farms });
  } catch (error) {
    return next(error);
  }
}

async function getFarm(req, res, next) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ success: false, error: "Invalid farm id" });
  try {
    const farm = await prisma.farm.findFirst({ where: { id, userId: req.user.id }, select: farmSelect });
    if (!farm) return res.status(404).json({ success: false, error: "Farm not found" });
    return res.json({ success: true, farm });
  } catch (error) {
    return next(error);
  }
}

async function updateFarm(req, res, next) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ success: false, error: "Invalid farm id" });
  const validationError = validateFarmFields(req.body, { partial: true });
  if (validationError) return res.status(400).json({ success: false, error: validationError });
  if (!Object.keys(req.body || {}).length) {
    return res.status(400).json({ success: false, error: "At least one farm field is required" });
  }
  try {
    const existing = await prisma.farm.findFirst({ where: { id, userId: req.user.id }, select: { id: true } });
    if (!existing) return res.status(404).json({ success: false, error: "Farm not found" });
    const farm = await prisma.farm.update({ where: { id }, data: farmData(req.body), select: farmSelect });
    return res.json({ success: true, farm });
  } catch (error) {
    return next(error);
  }
}

async function deleteFarm(req, res, next) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ success: false, error: "Invalid farm id" });
  try {
    const existing = await prisma.farm.findFirst({ where: { id, userId: req.user.id }, select: { id: true } });
    if (!existing) return res.status(404).json({ success: false, error: "Farm not found" });
    await prisma.farm.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = { createFarm, deleteFarm, getFarm, listFarms, updateFarm };
