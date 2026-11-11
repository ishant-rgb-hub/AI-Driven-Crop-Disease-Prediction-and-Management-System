const prisma = require("../config/database");

// GET /api/diseases   (optional filter: ?crop=Tomato)
exports.getDiseases = async (req, res, next) => {
  try {
    const { crop } = req.query;
    const where = crop ? { cropName: { equals: crop, mode: "insensitive" } } : {};

    const diseases = await prisma.disease.findMany({
      where,
      select: {
        id: true,
        name: true,
        cropName: true,
        displayName: true,
        description: true,
        isHealthy: true,
      },
      orderBy: [{ cropName: "asc" }, { displayName: "asc" }],
    });

    res.json(diseases);
  } catch (err) {
    next(err);
  }
};

// GET /api/diseases/:id
exports.getDiseaseById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: "Invalid disease id" });
    }

    const disease = await prisma.disease.findUnique({ where: { id } });
    if (!disease) {
      return res.status(404).json({ error: "Disease not found" });
    }

    res.json(disease);
  } catch (err) {
    next(err);
  }
};
