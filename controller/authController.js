const AdminUser = require("../models/AdminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Admin login
const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // 2. Hardcoded super admin
    if (username === "super_admin" && password === "admin12345") {
      if (!process.env.JWT_SECRETKEY) {
        return res.status(500).json({ message: "JWT_SECRETKEY is missing in environment variables" });
      }

      const token = jwt.sign(
        { username: "super_admin", role: "super_admin" },
        process.env.JWT_SECRETKEY,
        { expiresIn: "1d" }
      );

      return res.json({ token, username: "super_admin", role: "super_admin" });
    }

    // 3. Find admin user in DB
    const adminUser = await AdminUser.findOne({ username });
    if (!adminUser) {
      return res.status(401).json({ message: "Invalid credentials (user not found)" });
    }

    // 4. Compare plain password with hashed password
    const isMatchPassword = await bcrypt.compare(password, adminUser.password);
    if (!isMatchPassword) {
      return res.status(401).json({ message: "Invalid credentials (wrong password)" });
    }

    // 5. Check JWT secret exists
    if (!process.env.JWT_SECRETKEY) {
      return res.status(500).json({ message: "JWT_SECRETKEY is missing in environment variables" });
    }

    // 6. Generate JWT token
    const token = jwt.sign(
      { username: adminUser.username, role: adminUser.role },
      process.env.JWT_SECRETKEY,
      { expiresIn: "24h" }
    );

    res.json({ token, username: adminUser.username, role: adminUser.role });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Example protected route (for testing super admin)
const getSuperAdminData = (req, res) => {
  res.json({ secret: "Only superadmins can see this." });
};

module.exports = { adminLogin, getSuperAdminData };
