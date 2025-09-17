// socket.js
const { saveMessage } = require("./controller/messageController");

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

    // join a room with user/admin id
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    // listen for sendMessage event
    socket.on("sendMessage", async (data) => {
      try {
        const savedMsg = await saveMessage(data);

        console.log("Emitting to room:", data.to); // Use the 'to' field from data
        io.to(data.to).emit("receiveMessage", savedMsg);
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}

module.exports = socketHandler;
