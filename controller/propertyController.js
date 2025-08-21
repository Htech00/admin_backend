const PropertyModel = require("../models/PropertyModel");
const cloudinary = require("cloudinary").v2;

const addNewProperty = async (req, res) => {
  try {
    console.log("FILES RECEIVED:", req.files);
    console.log("BODY RECEIVED:", req.body);

    const {
      title,
      propertyType,
      city,
      area,
      score,
      reviewCount,
      rooms,
      bathrooms,
      size,
      pricePerNight,
      latitude,
      longitude,
      amenities,
      description
    } = req.body;

    // Upload all files to Cloudinary
    // Promise.all() if one of the files fails to upload then it stop everything and jump to the catch
    const uploadResults = await Promise.all(
      req.files.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path);
          return result;
        } catch (err) {
          console.error("Cloudinary upload failed:", err);
          throw err; // This will break the Promise.all and go to outer catch
        }
      })
    );

    // Extract URLs
    const imageUrls = uploadResults.map((result) => result.secure_url);

    // Convert amenities string to array if needed
    if (amenities) {
      if (Array.isArray(amenities)) {
        amenitiesArray = amenities.map((a) => a.trim()).filter((a) => a);
      } else if (typeof amenities === "string") {
        amenitiesArray = amenities
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a);
      }
    }
    // Save to MongoDB
    const property = await PropertyModel.create({
      title,
      propertyType,
      city,
      area,
      score: score ? parseFloat(score) : undefined,
      reviewCount: reviewCount ? parseInt(reviewCount) : undefined,
      rooms: rooms ? parseInt(rooms) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
      size: size ? parseFloat(size) : undefined,
      pricePerNight: pricePerNight ? parseFloat(pricePerNight) : undefined,
      images: imageUrls,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      amenities: amenitiesArray,
      description: description
    });

    res.status(201).json(property);
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ error: err.message });
  }
};

const getEachProperties = async (req, res) => {
  try {
    const goal = await PropertyModel.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    res.status(200).json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateProperties = async (req, res) => {
  try {
    console.log("FILES RECEIVED:", req.files);
    console.log("BODY RECEIVED:", req.body);

    const {
      title,
      propertyType,
      city,
      area,
      score,
      reviewCount,
      rooms,
      bathrooms,
      size,
      pricePerNight,
      latitude,
      longitude,
      amenities,
      description,
    } = req.body;

    const propertyId = req.params.id; // 👈 Get ID from route params

    if (!propertyId) {
      return res.status(400).json({ error: "Missing property ID in request" });
    }

    let amenitiesArray = [];

    // Upload new images to Cloudinary
    const imageUrls = req.files?.length
      ? await Promise.all(
          req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path);
            return result.secure_url;
          })
        )
      : [];

    // Convert amenities string to array if needed
    if (amenities) {
      if (Array.isArray(amenities)) {
        amenitiesArray = amenities.map((a) => a.trim()).filter((a) => a);
      } else if (typeof amenities === "string") {
        amenitiesArray = amenities
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a);
      }
    }

    // Build update payload
    const updatedData = {
      ...(title && { title }),
      ...(propertyType && { propertyType }),
      ...(city && { city }),
      ...(area && { area }),
      ...(score && { score: parseFloat(score) }),
      ...(reviewCount && { reviewCount: parseInt(reviewCount) }),
      ...(rooms && { rooms: parseInt(rooms) }),
      ...(bathrooms && { bathrooms: parseInt(bathrooms) }),
      ...(size && { size: parseFloat(size) }),
      ...(pricePerNight && { pricePerNight: parseFloat(pricePerNight) }),
      ...(latitude &&
        longitude && {
          location: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
        }),
      ...(amenitiesArray.length && { amenities: amenitiesArray }),
      ...(description && { description }),
      ...(imageUrls.length && { images: imageUrls }),
    };

    // Update in DB
    const updatedProperty = await PropertyModel.findByIdAndUpdate(
      propertyId,
      updatedData,
      { new: true } // returns the updated document
    );

    if (!updatedProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json(updatedProperty);
  } catch (err) {
    console.error("❌ Property update failed:", err);
    res.status(500).json({ error: err.message });
  }
};

// Find Properties Near a Location
const getNearbyProperties = async (req, res) => {
  const { lat, lng, maxDistance = 5000 } = req.query; // distance in 5000 meters or 5km
  try {
    const properties = await PropertyModel.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    });

    res.json(properties);
  } catch (error) {
    console.error("Error finding nearby properties:", error);
    res.status(500).json({ message: "Error fetching nearby properties" });
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
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      PropertyModel.find().skip(skip).limit(limit),
      PropertyModel.countDocuments(),
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

const propertyCount = async (req, res) => {
  try {
      const count = await PropertyModel.countDocuments({});
      res.status(200).json({ totalCount: count });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching count' });
    }
}

module.exports = {
  addNewProperty,
  updateProperties,
  getNearbyProperties,
  fetchAllData,
  getPaginatedProperties,
  deleteProperty,
  propertyCount,
  getEachProperties
};
