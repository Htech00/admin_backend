const PropertyModel = require("../models/PropertyModel")

// ====== CONTROLLER FOR CREATING/POST A NEW Property =======

const addNewProperty = async (req, res) => {

  try {
    const { title,location:{city, area},rating:{score,reviewCount},rooms,bathrooms,size,pricePerNight} = req.body;

    const imagePaths = req.files?.map(file => file.path) || [];

    const property = await PropertyModel.create({ title,location:{city, area},rating:{score,reviewCount},rooms,bathrooms,size,pricePerNight, images: imagePaths });

    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = addNewProperty
