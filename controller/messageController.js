const Message = require("../models/MessageModel");

// Save message (used by Socket.io)
exports.saveMessage = async ({ fromId, toId, text }) => {
  const message = await Message.create({
    from: fromId,
    to: toId,
    text,
    read: false,
  });
  return message;
};

// Get all messages for a user
exports.getMessages = async (req, res) => {
  const { userId } = req.params;
  const messages = await Message.find({
    $or: [{ from: userId }, { to: userId }]
  }).sort({ createdAt: 1 });
  res.json(messages);
};

// Mark as read
exports.markAsRead = async (req, res) => {
  const { id } = req.params;
  const message = await Message.findByIdAndUpdate(id, { read: true }, { new: true });
  res.json(message);
};
