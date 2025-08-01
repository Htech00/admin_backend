// routes/propertyRoute.js

const express = require("express");
const router = express.Router();
const addNewProperty = require("../controller/propertyController");
const upload = require("../middleware/upload");

router.post("/", (req, res) => {
  upload.array("images", 10)(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: err.message });
    }
    addNewProperty(req, res);
  });
});

module.exports = router;
