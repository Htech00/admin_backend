const mongoose = require("mongoose");
const { userConnection } = require("../db");

const registerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$/, "Invalid Email"],
  },

  number: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = userConnection.model("RegisterModel", registerSchema);
