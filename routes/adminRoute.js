const express = require("express");
const addAdmin = require("../controller/adminController");

const router = express.Router();

router.post("/addAdmin", addAdmin)

module.exports = router