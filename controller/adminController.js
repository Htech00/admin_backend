const AdminModel = require("../models/AdminModel");

const bcrypt = require("bcrypt");

const addAdmin = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new AdminModel({
      username,
      password: hashedPassword,
      role,
    });

    await newAdmin.save();
    res
      .status(201)
      .json({ message: "Admin created successfully", admin: newAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = addAdmin
