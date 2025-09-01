const express = require("express");
// routes/authRoute.js (for users)
const {
  addAdmin,
  getPaginatedAdmin,
  deleteAdmin,
} = require("../controller/adminController");

const router = express.Router();

router.post("/addAdmin", addAdmin);
router.get("/view", getPaginatedAdmin);
router.delete("/:id", deleteAdmin);

module.exports = router;
