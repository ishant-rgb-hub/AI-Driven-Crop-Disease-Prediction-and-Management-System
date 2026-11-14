
const prisma = require("../config/database");

// Create feedback
const createFeedback = async (req, res, next) => {
  try {
    const { rating, isCorrect, comment, predictionId } = req.body;

    if (rating === undefined || predictionId === undefined) {
      return res.status(400).json({
        success: false,
        message: "Rating and predictionId are required"
      });
    }

    const ratingNumber = Number(rating);
    const predictionIdNumber = Number(predictionId);

    if (!Number.isInteger(ratingNumber) ||
        ratingNumber < 1 || ratingNumber > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5"
      });
    }

    if (!Number.isInteger(predictionIdNumber) ||
        predictionIdNumber <= 0) {
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

    const feedback = await prisma.predictionFeedback.create({
      data: {
        rating: ratingNumber,
        isCorrect: isCorrect ?? null,
        comment: comment ?? null,
        predictionId: predictionIdNumber
      }
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Feedback already exists for this prediction"
      });
    }
    next(error);
  }
};

// Get all feedback
const getAllFeedback = async (req, res, next) => {
  try {
    const feedback = await prisma.predictionFeedback.findMany({
      include: { prediction: true },
      orderBy: { createdAt: "desc" }
    });

    return res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

// Get feedback by ID
const getFeedbackById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback ID"
      });
    }

    const feedback = await prisma.predictionFeedback.findUnique({
      where: { id },
      include: { prediction: true }
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

// Update feedback
const updateFeedback = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { rating, isCorrect, comment } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback ID"
      });
    }

    const data = {};

    if (rating !== undefined) {
      const ratingNumber = Number(rating);

      if (!Number.isInteger(ratingNumber) ||
          ratingNumber < 1 || ratingNumber > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be an integer between 1 and 5"
        });
      }

      data.rating = ratingNumber;
    }

    if (isCorrect !== undefined) {
      if (typeof isCorrect !== "boolean" && isCorrect !== null) {
        return res.status(400).json({
          success: false,
          message: "isCorrect must be true, false, or null"
        });
      }
      data.isCorrect = isCorrect;
    }

    if (comment !== undefined) {
      if (comment !== null && typeof comment !== "string") {
        return res.status(400).json({
          success: false,
          message: "Comment must be a string or null"
        });
      }
      data.comment = comment;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update"
      });
    }

    const feedback = await prisma.predictionFeedback.update({
      where: { id },
      data
    });

    return res.status(200).json({
      success: true,
      message: "Feedback updated successfully",
      data: feedback
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Feedback not found"
      });
    }
    next(error);
  }
};

// Delete feedback
const deleteFeedback = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback ID"
      });
    }

    await prisma.predictionFeedback.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully"
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Feedback not found"
      });
    }
    next(error);
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback
};
