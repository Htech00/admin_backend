const express = require("express");
const router = express.Router();
const addNewProperty = require("../controller/propertyController");
const upload = require("../middleware/upload"); // add this

// 👇 Include multer middleware before the controller
router.post(
  '/',
  upload.array('images', 10),
  (req, res, next) => {
    console.log('FILES', req.files);
    addNewProperty(req, res).catch(next);
  },
  (err, req, res, next) => {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
);
module.exports = router;