const AdminModel = require("../models/AdminModel");

const bcrypt = require("bcrypt");
const { adminLogin } = require("./authController");

const addAdmin = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existingAdmin = await AdminModel.findOne({ username });
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

const listAdmin = async () => {
  try {
    const fetchAdminData = await AdminModel.find();
    res.status(200).json(fetchAdminData);
  } catch (err) {
    console.log("Failed to fetch data", err);
  }
  
}

const getPaginatedAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      AdminModel.find().skip(skip).limit(limit),
      AdminModel.countDocuments(),
    ]);

    res.status(200).json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAdmin = await adminLogin.findByIdAndDelete(id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {addAdmin,listAdmin,deleteAdmin,getPaginatedAdmin}
