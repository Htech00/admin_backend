const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: String,
  city: String,
  area: String,
  score: Number,
  reviewCount: Number,
  rooms: Number,
  bathrooms: Number,
  size: Number,
  pricePerNight: Number,
  images: [String], // array of image file paths
});

module.exports = mongoose.model("Property", propertySchema);