const Property = require("../models/PropertyModel");

const addNewProperty = async (req, res) => {
  try {
    const imagePaths = req.files.map((file) => file.path);

    const newProperty = new Property({
      ...req.body,
      images: imagePaths,
    });

    await newProperty.save();
    res.status(201).json({ message: "Property added", property: newProperty });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = addNewProperty;