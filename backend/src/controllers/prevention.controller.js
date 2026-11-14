
const prisma = require("../config/database");


const createPrevention = async (req, res, next) => {
  try {
    const { title, description, diseaseId } = req.body;

    if (
      typeof title !== "string" || !title.trim() ||
      typeof description !== "string" || !description.trim() ||
      !Number.isInteger(Number(diseaseId)) ||
      Number(diseaseId) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid title, description and diseaseId are required"
      });
    }

    const disease = await prisma.disease.findUnique({
      where: { id: Number(diseaseId) }
    });

    if (!disease) {
      return res.status(404).json({
        success: false,
        message: "Disease not found"
      });
    }

    const prevention = await prisma.prevention.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        diseaseId: Number(diseaseId)
      }
    });

    res.status(201).json({
      success: true,
      message: "Prevention created successfully",
      data: prevention
    });
  } catch (error) {
    next(error);
  }
};

// Get all preventions
const getAllPreventions = async (req, res, next) => {
  try {
    const preventions = await prisma.prevention.findMany({
      include: { disease: true },
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json({
      success: true,
      count: preventions.length,
      data: preventions
    });
  } catch (error) {
    next(error);
  }
};

// Get prevention by ID
const getPreventionById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid prevention ID"
      });
    }

    const prevention = await prisma.prevention.findUnique({
      where: { id },
      include: { disease: true }
    });

    if (!prevention) {
      return res.status(404).json({
        success: false,
        message: "Prevention not found"
      });
    }

    res.status(200).json({
      success: true,
      data: prevention
    });
  } catch (error) {
    next(error);
  }
};

// Get preventions by disease ID
const getPreventionsByDisease = async (req, res, next) => {
  try {
    const diseaseId = Number(req.params.diseaseId);

    if (!Number.isInteger(diseaseId) || diseaseId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid disease ID"
      });
    }

    const preventions = await prisma.prevention.findMany({
      where: { diseaseId },
      include: { disease: true },
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json({
      success: true,
      count: preventions.length,
      data: preventions
    });
  } catch (error) {
    next(error);
  }
};

// Update prevention
const updatePrevention = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, description, diseaseId } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid prevention ID"
      });
    }

    const data = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title must be a non-empty string"
        });
      }
      data.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string" || !description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Description must be a non-empty string"
        });
      }
      data.description = description.trim();
    }

    if (diseaseId !== undefined) {
      const parsedDiseaseId = Number(diseaseId);

      if (!Number.isInteger(parsedDiseaseId) || parsedDiseaseId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid disease ID"
        });
      }

      const disease = await prisma.disease.findUnique({
        where: { id: parsedDiseaseId }
      });

      if (!disease) {
        return res.status(404).json({
          success: false,
          message: "Disease not found"
        });
      }

      data.diseaseId = parsedDiseaseId;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update"
      });
    }

    const prevention = await prisma.prevention.update({
      where: { id },
      data,
      include: { disease: true }
    });

    res.status(200).json({
      success: true,
      message: "Prevention updated successfully",
      data: prevention
    });
  } catch (error) {
    next(error);
  }
};

// Delete prevention
const deletePrevention = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid prevention ID"
      });
    }

    await prisma.prevention.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: "Prevention deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPrevention,
  getAllPreventions,
  getPreventionById,
  getPreventionsByDisease,
  updatePrevention,
  deletePrevention
};
