const express = require("express");
const addNewProperty = require("../controller/propertyController");


const router = express.Router();

router.post("/", addNewProperty)

module.exports = router;