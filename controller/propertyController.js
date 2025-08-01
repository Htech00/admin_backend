const PropertyModel = require("../models/PropertyModel");

const addNewProperty = async (req, res) => {
  try {
    console.log("FILES RECEIVED:", req.files);
    console.log("BODY RECEIVED:", req.body);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

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

    // Convert numeric fields from strings to numbers explicitly:
    const property = await PropertyModel.create({
      title,
      city,
      area,
      score: parseFloat(score),
      reviewCount: parseInt(reviewCount),
      rooms: parseInt(rooms),
      bathrooms: parseInt(bathrooms),
      size: parseFloat(size),
      pricePerNight: parseFloat(pricePerNight),
      images: req.files.map(file => file.path),
    });

    res.status(201).json(property);
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = addNewProperty;
