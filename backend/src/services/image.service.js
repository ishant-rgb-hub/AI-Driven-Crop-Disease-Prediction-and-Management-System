const prisma = require("../config/database");

exports.saveImageRecord = (file, userId) =>
  prisma.cropImage.create({
    data: {
      url: `/uploads/${file.filename}`,
      filename: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      userId,
    },
  });
