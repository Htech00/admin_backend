const AdminUser = require("../models/AdminModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt") 

const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hardcoded super admin
    if (username === "super_admin" && password === "admin12345") {
      const token = jwt.sign(
        { username: "super_admin", role: "super_admin" },
        process.env.JWT_SECRETKEY,
        { expiresIn: "1d" }
      );
      return res.json({ token, username: "super_admin", role: "super_admin" });
    }

    // Find user by username
    const adminUser = await AdminUser.findOne({ username });
    if (!adminUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare plain password with hashed password
    const isMatchPassword = await bcrypt.compare(password, adminUser.password);
    if (!isMatchPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { username: adminUser.username, role: adminUser.role },
      process.env.JWT_SECRETKEY,
      { expiresIn: "24h" }
    );

    res.json({ token, username: adminUser.username, role: adminUser.role });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

const getSuperAdminData = (req, res) => {
  res.json({ secret: "Only superadmins can see this." });
}

module.exports = {adminLogin, getSuperAdminData}


