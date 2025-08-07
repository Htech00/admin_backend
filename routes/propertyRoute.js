// routes/propertyRoute.js

const express = require("express");
const router = express.Router();
const {addNewProperty, fetchAllData, getPaginatedProperties, deleteProperty} = require("../controller/propertyController");
// const upload = require("../middleware/upload");
const upload = require('../utils/multer');

// router.post("/", (req, res) => {
//   upload.array("images", 10)(req, res, (err) => {
//     if (err) {
//       console.error("Multer error:", err);
//       return res.status(400).json({ error: err.message });
//     }
//     addNewProperty(req, res);
//   });
// });

router.post('/create', upload.array('images', 5), addNewProperty);


//fetch all data routes
router.get("/all",fetchAllData)

//fetch parginated data for view properties
router.get('/view', getPaginatedProperties)

// deleting router
router.delete("/:id", deleteProperty);


module.exports = router;
