const fs = require("node:fs/promises");
const prisma = require("../config/database");
const { saveImageRecord } = require("../services/image.service");
const { runPrediction } = require("../services/prediction.service");

async function removeUploadedFile(file) {
  if (!file?.path) return;

  try {
    await fs.unlink(file.path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

async function removeImageRecord(image, file) {
  try {
    if (image) await prisma.cropImage.delete({ where: { id: image.id } });
  } finally {
    await removeUploadedFile(file);
  }
}

function parseOptionalCropId(value) {
  if (value === undefined || value === "") return null;
  const cropId = Number(value);
  if (!Number.isInteger(cropId) || cropId < 1) {
    const error = new Error("cropId must be a positive integer");
    error.status = 400;
    throw error;
  }
  return cropId;
}

function predictionResponse(prediction) {
  return {
    id: prediction.id,
    confidence: prediction.confidence,
    createdAt: prediction.createdAt,
    cropId: prediction.cropId,
    image: {
      id: prediction.image.id,
      url: prediction.image.url,
      filename: prediction.image.filename,
      uploadedAt: prediction.image.uploadedAt,
    },
    disease: prediction.disease,
  };
}

exports.createPrediction = async (req, res, next) => {
  let image;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required (field name: image)" });
    }

    image = await saveImageRecord(req.file, req.user.id);
    const cropId = parseOptionalCropId(req.body.cropId);

    if (cropId !== null) {
      const crop = await prisma.crop.findUnique({ where: { id: cropId } });
      if (!crop) {
        const error = new Error("Crop not found");
        error.status = 404;
        throw error;
      }
    }

    const result = await runPrediction(image);
    const prediction = await prisma.prediction.create({
      data: {
        confidence: result.confidence,
        rawLabel: result.rawLabel,
        userId: req.user.id,
        cropId,
        imageId: image.id,
        diseaseId: result.disease.id,
      },
      include: {
        image: true,
        disease: true,
      },
    });

    return res.status(201).json(predictionResponse(prediction));
  } catch (error) {
    try {
      await removeImageRecord(image, req.file);
    } catch (cleanupError) {
      cleanupError.cause = error;
      return next(cleanupError);
    }
    return next(error);
  }
};

exports.listPredictions = async (req, res, next) => {
  try {
    const predictions = await prisma.prediction.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { image: true, disease: true },
    });

    return res.json(predictions.map(predictionResponse));
  } catch (error) {
    return next(error);
  }
};

exports.getPrediction = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: "Invalid prediction id" });
    }

    const prediction = await prisma.prediction.findFirst({
      where: { id, userId: req.user.id },
      include: { image: true, disease: true },
    });

    if (!prediction) {
      return res.status(404).json({ error: "Prediction not found" });
    }

    return res.json(predictionResponse(prediction));
  } catch (error) {
    return next(error);
  }
};
