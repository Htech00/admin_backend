const PropertyModel = require("../models/PropertyModel")

// ====== CONTROLLER FOR CREATING/POST A NEW Property =======

const addNewProperty = async (req, res) => {

  try {
    const {
      title,
      city,
      area,
      score,
      reviewCount,
      rooms,
      bathrooms,
      size,
      pricePerNight,
    } = req.body;

    const imagePaths = req.files?.map(file => file.path) || [];

    const property = await PropertyModel.create({
      title,
      city,
      area,
      score,
      reviewCount,
      rooms,
      bathrooms,
      size,
      pricePerNight,
      images: imagePaths, // Important: match this with schema
    });

    res.status(201).json(property);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = addNewProperty
