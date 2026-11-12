
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Get all treatments
const getAllTreatments = async (req, res, next) => {
  try {
    const treatments = await prisma.treatment.findMany({
      include: {
        disease: true
      }
    });

    res.status(200).json({
      success: true,
      count: treatments.length,
      data: treatments
    });
  } catch (error) {
    next(error);
  }
};

// Get treatment by ID
const getTreatmentById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid treatment ID"
      });
    }

    const treatment = await prisma.treatment.findUnique({
      where: { id },
      include: { disease: true }
    });

    if (!treatment) {
      return res.status(404).json({
        success: false,
        message: "Treatment not found"
      });
    }

    res.status(200).json({
      success: true,
      data: treatment
    });
  } catch (error) {
    next(error);
  }
};

// Get treatments by disease ID
const getTreatmentsByDisease = async (req, res, next) => {
  try {
    const diseaseId = Number(req.params.diseaseId);

    if (!Number.isInteger(diseaseId) || diseaseId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid disease ID"
      });
    }

    const treatments = await prisma.treatment.findMany({
      where: { diseaseId }
    });

    res.status(200).json({
      success: true,
      count: treatments.length,
      data: treatments
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTreatments,
  getTreatmentById,
  getTreatmentsByDisease
};
