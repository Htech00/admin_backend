const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatController");

// get currently active admin
router.get("/active-admin", chatController.getActiveAdmin);

// REST send message (optional, since socket handles most sending)
router.post("/send", chatController.sendMessage);

// get full chat history between admin & user
router.get("/history/:adminUsername/:userUsername", chatController.getChatHistory);
// Get unread messages for admin (notifications)
router.get("/admin/notifications/all", chatController.getAdminNotifications);

// Mark messages as read (admin)
router.put("/read/:userId", chatController.markAsRead);

module.exports = router;
