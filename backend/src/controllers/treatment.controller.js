
const prisma = require("../config/database");


const createTreatment = async (req, res, next) => {
  try {
    const {
      title,
      description,
      applicationMethod,
      safetyNotes,
      diseaseId
    } = req.body;

    if (
      typeof title !== "string" || !title.trim() ||
      typeof description !== "string" || !description.trim() ||
      typeof applicationMethod !== "string" ||
      !applicationMethod.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, description and applicationMethod are required"
      });
    }

    if (!Number.isInteger(diseaseId) || diseaseId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid diseaseId is required"
      });
    }

    if (
      safetyNotes !== undefined &&
      safetyNotes !== null &&
      typeof safetyNotes !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Safety notes must be text or null"
      });
    }

    const disease = await prisma.disease.findUnique({
      where: { id: diseaseId }
    });

    if (!disease) {
      return res.status(404).json({
        success: false,
        message: "Disease not found"
      });
    }

    const treatment = await prisma.treatment.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        applicationMethod: applicationMethod.trim(),
        safetyNotes: safetyNotes?.trim() || null,
        diseaseId
      }
    });

    res.status(201).json({
      success: true,
      message: "Treatment created successfully",
      data: treatment
    });

  } catch (error) {
    next(error);
  }
};


const getAllTreatments = async (req, res, next) => {
  try {
    const treatments = await prisma.treatment.findMany({
      include: { disease: true },
      orderBy: { createdAt: "desc" }
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
      where: { diseaseId },
      include: { disease: true },
      orderBy: { createdAt: "desc" }
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



const updateTreatment = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid treatment ID"
      });
    }

    const {
      title,
      description,
      applicationMethod,
      safetyNotes
    } = req.body;

    const data = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Invalid title"
        });
      }
      data.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string" || !description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Invalid description"
        });
      }
      data.description = description.trim();
    }

    if (applicationMethod !== undefined) {
      if (
        typeof applicationMethod !== "string" ||
        !applicationMethod.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid application method"
        });
      }
      data.applicationMethod = applicationMethod.trim();
    }

    if (safetyNotes !== undefined) {
      if (safetyNotes !== null && typeof safetyNotes !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid safety notes"
        });
      }
      data.safetyNotes = safetyNotes?.trim() || null;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update"
      });
    }

    const treatment = await prisma.treatment.update({
      where: { id },
      data,
      include: { disease: true }
    });

    res.status(200).json({
      success: true,
      message: "Treatment updated successfully",
      data: treatment
    });

  } catch (error) {
    next(error);
  }
};



const deleteTreatment = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid treatment ID"
      });
    }

    await prisma.treatment.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: "Treatment deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};



module.exports = {
  createTreatment,
  getAllTreatments,
  getTreatmentById,
  getTreatmentsByDisease,
  updateTreatment,
  deleteTreatment
};
