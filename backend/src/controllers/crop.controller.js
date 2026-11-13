const prisma = require("../config/database");
const { validateCropFields } = require("../utils/validation");

const cropSelect = {
  id: true,
  cropName: true,
  cropVariety: true,
  plantingDate: true,
  expectedHarvestDate: true,
  growthStage: true,
  farmId: true,
  createdAt: true,
  updatedAt: true,
};

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function cropData(body) {
  return {
    ...(body.cropName !== undefined ? { cropName: body.cropName.trim() } : {}),
    ...(body.cropVariety !== undefined
      ? { cropVariety: body.cropVariety === null ? null : body.cropVariety.trim() }
      : {}),
    ...(body.plantingDate !== undefined
      ? { plantingDate: body.plantingDate === null ? null : new Date(`${body.plantingDate}T00:00:00.000Z`) }
      : {}),
    ...(body.expectedHarvestDate !== undefined
      ? { expectedHarvestDate: body.expectedHarvestDate === null ? null : new Date(`${body.expectedHarvestDate}T00:00:00.000Z`) }
      : {}),
    ...(body.growthStage !== undefined
      ? { growthStage: body.growthStage === null ? null : body.growthStage.trim() }
      : {}),
  };
}

async function findOwnedFarm(farmId, userId) {
  return prisma.farm.findFirst({
    where: { id: farmId, userId },
    select: { id: true },
  });
}

async function createCrop(req, res, next) {
  const farmId = parseId(req.params.farmId);
  if (!farmId) return res.status(400).json({ success: false, error: "Invalid farm id" });
  const validationError = validateCropFields(req.body);
  if (validationError) return res.status(400).json({ success: false, error: validationError });

  try {
    const farm = await findOwnedFarm(farmId, req.user.id);
    if (!farm) return res.status(404).json({ success: false, error: "Farm not found" });
    const crop = await prisma.crop.create({
      data: { ...cropData(req.body), farmId },
      select: cropSelect,
    });
    return res.status(201).json({ success: true, crop });
  } catch (error) {
    return next(error);
  }
}

async function listFarmCrops(req, res, next) {
  const farmId = parseId(req.params.farmId);
  if (!farmId) return res.status(400).json({ success: false, error: "Invalid farm id" });

  try {
    const farm = await findOwnedFarm(farmId, req.user.id);
    if (!farm) return res.status(404).json({ success: false, error: "Farm not found" });
    const crops = await prisma.crop.findMany({
      where: { farmId },
      select: cropSelect,
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, crops });
  } catch (error) {
    return next(error);
  }
}

async function getCrop(req, res, next) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ success: false, error: "Invalid crop id" });

  try {
    const crop = await prisma.crop.findFirst({
      where: { id, farm: { is: { userId: req.user.id } } },
      select: cropSelect,
    });
    if (!crop) return res.status(404).json({ success: false, error: "Crop not found" });
    return res.json({ success: true, crop });
  } catch (error) {
    return next(error);
  }
}

async function updateCrop(req, res, next) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ success: false, error: "Invalid crop id" });
  const validationError = validateCropFields(req.body, { partial: true });
  if (validationError) return res.status(400).json({ success: false, error: validationError });
  if (!Object.keys(req.body || {}).length) {
    return res.status(400).json({ success: false, error: "At least one crop field is required" });
  }

  try {
    const existing = await prisma.crop.findFirst({
      where: { id, farm: { is: { userId: req.user.id } } },
      select: { id: true },
    });
    if (!existing) return res.status(404).json({ success: false, error: "Crop not found" });
    const crop = await prisma.crop.update({
      where: { id },
      data: cropData(req.body),
      select: cropSelect,
    });
    return res.json({ success: true, crop });
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ success: false, error: "Crop not found" });
    return next(error);
  }
}

async function deleteCrop(req, res, next) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ success: false, error: "Invalid crop id" });

  try {
    const existing = await prisma.crop.findFirst({
      where: { id, farm: { is: { userId: req.user.id } } },
      select: { id: true },
    });
    if (!existing) return res.status(404).json({ success: false, error: "Crop not found" });
    await prisma.crop.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ success: false, error: "Crop not found" });
    return next(error);
  }
}

module.exports = { createCrop, deleteCrop, getCrop, listFarmCrops, updateCrop };
