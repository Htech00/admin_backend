const Chat = require("../models/chatModel");
const Admin = require("../models/AdminModel");

// Get the active admin
exports.getActiveAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne(); // You can change this to logged-in admin
    if (!admin) return res.status(404).json({ error: "No admin found" });

    res.json({ adminId: admin._id.toString(), username: admin.username || "unlnown" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Send message via REST (optional if you want)
exports.sendMessage = async (req, res) => {
  try {
    //Destructuring to Gets message details from the request.
    const { senderId, senderType, receiverId, receiverType, message } =
      req.body;

    const newMessage = await Chat.create({
      senderId,
      senderType,
      receiverId,
      receiverType,
      message,
    });

    //Emits the message in real time to the receiver using Socket.IO.
    req.io.to(receiverId).emit("receiveMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Get full chat history between user & admin
//Finds all messages where either the admin sent it to the user, or the user sent it to the admin.
exports.getChatHistory = async (req, res) => {
  try {
    const { adminUsername, userUsername } = req.params;

    const messages = await Chat.find({
      $or: [
        { senderId: adminUsername, receiverId: userUsername },
        { senderId: userUsername, receiverId: adminUsername },
      ],
      //Sorts messages in chronological order (createdAt: 1).
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

exports.getAdminNotifications = async (req, res) => {
  try {
    const unreadMessages = await Chat.find({
      receiverType: "admin",
      read: false,
    }).sort({ createdAt: -1 });

    res.json(unreadMessages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark all messages from a user as read
exports.markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Chat.updateMany(
      { senderId: userId, senderType: "user", read: false },
      { $set: { read: true } }
    );

    res.json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
