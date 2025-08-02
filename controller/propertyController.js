const PropertyModel = require("../models/PropertyModel");

const addNewProperty = async (req, res) => {
  try {
    console.log("FILES RECEIVED:", req.files);
    console.log("BODY RECEIVED:", req.body);

    // Convert numbers explicitly
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
      score: score ? parseFloat(score) : undefined,
      reviewCount: reviewCount ? parseInt(reviewCount) : undefined,
      rooms: rooms ? parseInt(rooms) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
      size: size ? parseFloat(size) : undefined,
      pricePerNight: pricePerNight ? parseFloat(pricePerNight) : undefined,
      images: imagePaths,
    });

    res.status(201).json(property);
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = addNewProperty;
