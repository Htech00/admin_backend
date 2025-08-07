const PropertyModel = require("../models/PropertyModel");

// const addNewProperty = async (req, res) => {
//   try {
//     console.log("FILES RECEIVED:", req.files);
//     console.log("BODY RECEIVED:", req.body);

//     // Convert numbers explicitly
//     const {
//       title,
//       city,
//       area,
//       score,
//       reviewCount,
//       rooms,
//       bathrooms,
//       size,
//       pricePerNight,
//     } = req.body;

//     const imagePaths = req.files?.map((file) => file.path) || []; //This line is safely extracting the file paths from uploaded files using optional chaining and mapping

//     const property = await PropertyModel.create({
//       title,
//       city,
//       area,
//       score: score ? parseFloat(score) : undefined,
//       reviewCount: reviewCount ? parseInt(reviewCount) : undefined,
//       rooms: rooms ? parseInt(rooms) : undefined,
//       bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
//       size: size ? parseFloat(size) : undefined,
//       pricePerNight: pricePerNight ? parseFloat(pricePerNight) : undefined,
//       images: imagePaths,
//     });

//     res.status(201).json(property);
//   } catch (err) {
//     console.error("❌ Upload failed:", err);
//     res.status(500).json({ error: err.message });
//   }
// };



const addNewProperty = async (req, res) => {
  try {
    console.log("FILES RECEIVED:", req.files);
    console.log("BODY RECEIVED:", req.body);

    const {
      title,
      city,
      area,
      score,
      reviewCount,
      rooms,
      bathrooms,
      size,
      pricePerNight,
    } = req.body;

    // Upload each file to Cloudinary and get the URL
    try {
  const result = await cloudinary.uploader.upload(file.path);
  // ...
} catch (err) {
  console.error("Cloudinary upload failed:", err);
  throw err; // so it's caught by your outer try/catch
}

    const uploadResults = await Promise.all(result);

    // Extract the URLs
    const imageUrls = uploadResults.map((result) => result.secure_url);

    const property = await PropertyModel.create({
      title,
      city,
      area,
      score: score ? parseFloat(score) : undefined,
      reviewCount: reviewCount ? parseInt(reviewCount) : undefined,
      rooms: rooms ? parseInt(rooms) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
      size: size ? parseFloat(size) : undefined,
      pricePerNight: pricePerNight ? parseFloat(pricePerNight) : undefined,
      images: imageUrls,
    });

    res.status(201).json(property);
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ error: err.message });
  }
};


const fetchAllData = async (req, res) => {
  try {
    const fetchData = await PropertyModel.find();
    res.status(200).json(fetchData);
    console.log(fetchData);
  } catch (err) {
    console.log("Failed to fetch data", err);
  }
};

const getPaginatedProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      PropertyModel.find().skip(skip).limit(limit),
      PropertyModel.countDocuments()
    ]);

    res.status(200).json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProperty = await PropertyModel.findByIdAndDelete(id);
    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



module.exports = { addNewProperty, fetchAllData, getPaginatedProperties, deleteProperty };
