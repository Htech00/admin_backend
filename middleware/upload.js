const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Must pass null as first argument for no error
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Unique name, including extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload;
