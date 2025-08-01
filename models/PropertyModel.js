const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    title: { 
            type: String, 
            required: true 
        }, 

    location: {
        city: { 
            type: String, 
            required: true 
        }, 

        area: {
            type: String 
            }, 
    },
    rating: {
        score: { 
            type: Number, 
            default: 0 
        }, 

        reviewCount: { 
            type: Number, 
            default: 0 
        }, // e.g., 21
    },

    rooms: { 
        type: Number, 
        default: 1 
    }, 
    bathrooms: {
        type: Number, 
        default: 1 
        }, 

    size: { 
        type: Number, 
        default: 0 
    }, 

    pricePerNight: { 
        type: Number, 
        required: true 
    }, 
    likedBy: [
        { 
            type: mongoose.Schema.Types.ObjectId, ref: "User" 
        }
    ], // List of user IDs who liked this property

    images: [{ 
        type: String 
    }], 

    createdAt: { 
        type: Date, default: Date.now 
    },
});

module.exports = mongoose.model("Property", propertySchema);
