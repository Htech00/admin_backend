// db.js
const mongoose = require("mongoose");

const userConnection = mongoose.createConnection(process.env.MONGO_URI_USER);
const adminConnection = mongoose.createConnection(process.env.MONGO_URI_ADMIN);
const chatConnection = mongoose.createConnection(process.env.MONGO_URI_CHAT);

// Debugging logs
userConnection.on("connected", () => console.log("User DB connected"));
userConnection.on("error", (err) => console.error("User DB error:", err));

adminConnection.on("connected", () => console.log("Admin DB connected"));
adminConnection.on("error", (err) => console.error("Admin DB error:", err));

chatConnection.on("connected", () => console.log("Chat DB connected"));
chatConnection.on("error", (err) => console.error("Chat DB error:", err));

module.exports = { userConnection, adminConnection, chatConnection };


//username:bookingChat
//password: Ojukwu123456789@

//mongodb+srv://bookingChat:Ojukwu123456789%40@cluster0.gf9adcl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0