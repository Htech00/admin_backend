const express = require("express")
const { adminLogin, getSuperAdminData } = require("../controller/authController")
const { verifyToken } = require("../middleware/auth")
const { checkSuperAdmin } = require("../middleware/checkSuperAdmin")

const router = express.Router()

router.post("/login", adminLogin)
router.get("/superadmin-data", verifyToken,checkSuperAdmin,getSuperAdminData)

module.exports = router;