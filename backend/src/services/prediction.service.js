const path = require("node:path");
const prisma = require("../config/database");
const ai = require("./ai.service");

const uploadsDirectory = path.resolve(__dirname, "..", "..", "uploads");

function getImagePath(imageRecord) {
  if (!imageRecord || typeof imageRecord.url !== "string") {
    const error = new Error("Prediction image record is invalid");
    error.status = 400;
    throw error;
  }

  const relativePath = imageRecord.url.replace(/^\/+/, "");
  const imagePath = path.resolve(__dirname, "..", "..", relativePath);

  if (!imagePath.startsWith(`${uploadsDirectory}${path.sep}`)) {
    const error = new Error("Prediction image path is invalid");
    error.status = 400;
    throw error;
  }

  return imagePath;
}

exports.runPrediction = async (imageRecord) => {
  const { label, confidence } = await ai.predict(getImagePath(imageRecord));
  const disease = await prisma.disease.findUnique({ where: { name: label } });

  if (!disease) {
    const error = new Error(`AI returned an unknown label: ${label}`);
    error.status = 502;
    throw error;
  }

  return { disease, confidence, rawLabel: label };
};
