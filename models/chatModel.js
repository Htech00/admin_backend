// models/chatModel.js
const { chatConnection } = require("../db");
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    senderType: { type: String, enum: ["user", "admin"], required: true },
    receiverId: { type: String, required: true },
    receiverType: { type: String, enum: ["user", "admin"], required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = chatConnection.model("Chat", chatSchema);
