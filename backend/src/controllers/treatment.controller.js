

const getTreatments = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Treatment API is working!",
            data: []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching treatments"
        });
    }
};


const getTreatmentById = async (req, res) => {
    try {
        const { id } = req.params;

        res.status(200).json({
            success: true,
            message: `Treatment requested for ID ${id}`,
            data: null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching treatment"
        });
    }
};

module.exports = {
    getTreatments,
    getTreatmentById
};
