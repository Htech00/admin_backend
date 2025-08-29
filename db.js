// db.js
const mongoose = require("mongoose");

const userConnection = mongoose.createConnection(process.env.MONGO_URI_USER);

const adminConnection = mongoose.createConnection(process.env.MONGO_URI_ADMIN);

// Listeners for debugging
userConnection.on("connected", () => {
  console.log("✅ User DB connected");
});

userConnection.on("error", (err) => {
  console.error("❌ User DB connection error:", err);
});

adminConnection.on("connected", () => {
  console.log("✅ Admin DB connected");
});

adminConnection.on("error", (err) => {
  console.error("❌ Admin DB connection error:", err);
});

module.exports = { userConnection, adminConnection };
