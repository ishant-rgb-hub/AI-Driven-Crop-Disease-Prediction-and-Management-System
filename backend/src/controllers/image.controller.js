const { saveImageRecord } = require("../services/image.service");

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Image file is required (field name: image)",
      });
    }

    const userId = req.user.id;

    const record = await saveImageRecord(req.file, userId);

    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
};
