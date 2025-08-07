// routes/propertyRoute.js

const express = require("express");
const router = express.Router();
const {addNewProperty, fetchAllData, getPaginatedProperties, deleteProperty} = require("../controller/propertyController");
// const upload = require("../middleware/upload");
const upload = require('../utils/multer');

//Router to add new properties 
router.post('/create', upload.array('images', 5), addNewProperty);


//fetch all data routes
router.get("/all",fetchAllData)

//fetch parginated data for view properties
router.get('/view', getPaginatedProperties)

// deleting router
router.delete("/:id", deleteProperty);


module.exports = router;
