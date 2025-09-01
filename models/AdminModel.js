const mongoose = require("mongoose");
const { adminConnection } = require("../db");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // store hashed in real apps
  role: { type: String },
});

module.exports = adminConnection.model("Admin", adminSchema);
