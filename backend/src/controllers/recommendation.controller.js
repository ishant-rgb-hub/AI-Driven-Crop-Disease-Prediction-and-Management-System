
const prisma = require("../config/database");

// Create a recommendation
const createRecommendation = async (req, res, next) => {
  try {
    const { title, description, category, priority, predictionId } = req.body;

    if (!title || !description || !category || !predictionId) {
      return res.status(400).json({
        success: false,
        message: "Title, description, category and predictionId are required"
      });
    }

    const id = Number(predictionId);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "predictionId must be a positive integer"
      });
    }

    const prediction = await prisma.prediction.findUnique({
      where: { id }
    });

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction not found"
      });
    }

    const recommendation = await prisma.recommendation.create({
      data: {
        title,
        description,
        category,
        priority: priority || "normal",
        predictionId: id
      }
    });

    return res.status(201).json({
      success: true,
      message: "Recommendation created successfully",
      data: recommendation
    });
  } catch (error) {
    next(error);
  }
};

// Get all recommendations
const getAllRecommendations = async (req, res, next) => {
  try {
    const recommendations = await prisma.recommendation.findMany({
      include: { prediction: true },
      orderBy: { createdAt: "desc" }
    });

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

// Get recommendation by ID
const getRecommendationById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid recommendation ID"
      });
    }

    const recommendation = await prisma.recommendation.findUnique({
      where: { id },
      include: { prediction: true }
    });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: "Recommendation not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    next(error);
  }
};

// Get recommendations by prediction ID
const getRecommendationsByPrediction = async (req, res, next) => {
  try {
    const predictionId = Number(req.params.predictionId);

    if (!Number.isInteger(predictionId) || predictionId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid prediction ID"
      });
    }

    const recommendations = await prisma.recommendation.findMany({
      where: { predictionId },
      orderBy: { createdAt: "desc" }
    });

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

// Update recommendation
const updateRecommendation = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, description, category, priority, predictionId } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid recommendation ID"
      });
    }

    const data = {};

    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (category !== undefined) data.category = category;
    if (priority !== undefined) data.priority = priority;

    if (predictionId !== undefined) {
      const predictionIdNumber = Number(predictionId);

      if (!Number.isInteger(predictionIdNumber) || predictionIdNumber <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid predictionId"
        });
      }

      const prediction = await prisma.prediction.findUnique({
        where: { id: predictionIdNumber }
      });

      if (!prediction) {
        return res.status(404).json({
          success: false,
          message: "Prediction not found"
        });
      }

      data.predictionId = predictionIdNumber;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update"
      });
    }

    const recommendation = await prisma.recommendation.update({
      where: { id },
      data
    });

    return res.status(200).json({
      success: true,
      message: "Recommendation updated successfully",
      data: recommendation
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Recommendation not found"
      });
    }
    next(error);
  }
};

// Delete recommendation
const deleteRecommendation = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid recommendation ID"
      });
    }

    await prisma.recommendation.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: "Recommendation deleted successfully"
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Recommendation not found"
      });
    }
    next(error);
  }
};

module.exports = {
  createRecommendation,
  getAllRecommendations,
  getRecommendationById,
  getRecommendationsByPrediction,
  updateRecommendation,
  deleteRecommendation
};
