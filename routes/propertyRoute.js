const express = require("express");
const router = express.Router();
const addNewProperty = require("../controller/propertyController");
const upload = require("../middleware/upload"); // add this

// 👇 Include multer middleware before the controller
router.post("/", upload.array("images", 10), addNewProperty);

module.exports = router;