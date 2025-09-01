const express = require("express");
const router = express.Router();
const Message = require("../models/MessageModel");

// Create message & emit notification
router.post("/", async (req, res) => {
  try {
    const { fromId, toId, text } = req.body;
    const message = await Message.create({ from: fromId, to: toId, text });

    // Emit Socket.io event
    const io = req.app.get("io");
    if (io) io.to(toId).emit("receiveMessage", message);

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create message" });
  }
});

// Mark message as read
router.put("/:id/read", async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
