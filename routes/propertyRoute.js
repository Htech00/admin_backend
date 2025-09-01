// routes/propertyRoute.js

const express = require("express");
const router = express.Router();
const {
  addNewProperty,
  fetchAllData,
  getPaginatedProperties,
  deleteProperty,
  getNearbyProperties,
  propertyCount,
  updateProperties,
  getEachProperties,
} = require("../controller/propertyController");
// const upload = require("../middleware/upload");
const upload = require("../utils/multer");

//Router to add new properties
router.post("/create", upload.array("images", 5), addNewProperty);

//Get each properties by id
router.get("/:id/each", getEachProperties);

//Router to Update properties
router.put("/update/:id", upload.array("images"), updateProperties);

//fetch all data routes
router.get("/nearby", getNearbyProperties);

//fetch all data routes
router.get("/all", fetchAllData);

//fetch parginated data for view properties
router.get("/view", getPaginatedProperties);

// deleting router
router.delete("/:id", deleteProperty);

//Count property router
router.get("/totalProperty", propertyCount);

module.exports = router;
