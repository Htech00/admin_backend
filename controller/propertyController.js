const PropertyModel = require("../models/PropertyModel");

const addNewProperty = async (req, res) => {
  try {
    console.log("FILES RECEIVED:", req.files); // log this
    console.log("BODY RECEIVED:", req.body);

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
      images: imagePaths,
    });

    res.status(201).json(property);
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = addNewProperty;
