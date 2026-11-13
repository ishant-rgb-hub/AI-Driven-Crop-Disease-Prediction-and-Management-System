const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const diseases = require("../../prisma/data/diseases");

const labels = diseases.map((disease) => disease.name);

exports.MODE = "mock";

exports.predict = async (imagePath) => {
  let image;

  try {
    image = await fs.readFile(imagePath);
  } catch (error) {
    const readError = new Error("Uploaded image could not be read");
    readError.status = 400;
    readError.cause = error;
    throw readError;
  }

  const hash = crypto.createHash("sha256").update(image).digest();
  const label = labels[hash[0] % labels.length];
  const confidence = Number((0.7 + (hash[1] / 255) * 0.29).toFixed(3));

  return { label, confidence };
};
