const Chat = require("../models/chatModel");

function socketHandler(io) {
  //This listens for new client connections to the Socket.IO server.
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    //Listens for the "join" event from the client.
    // Join a room by username (user or admin)
    socket.on("join", (username) => {
      socket.join(username);
      console.log(`${username} joined room`);
    });

    // Handle sending message
    //Listens for "sendMessage" event, which the client triggers when sending a chat message.
    socket.on("sendMessage", async (data) => {
      try {
        const { senderId, senderType, receiverId, receiverType, message } =
          data;

        //Makes sure receiverId exists. If not, it logs an error and returns early (doesn’t process the message).
        if (!receiverId) {
          console.error("receiverId missing in message:", data);
          return;
        }

        // Save to DB
        const newMessage = await Chat.create({
          senderId,
          senderType,
          receiverId,
          receiverType,
          message,
        });

        // Emit to receiver room
        //Sends the new message to the receiver's room so they get the message in real-time.
        io.to(receiverId).emit("receiveMessage", newMessage);

        // Emit back to sender so they see their message instantly
        io.to(senderId).emit("receiveMessage", newMessage);
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    // When the client disconnects (closes browser, loses connection), this event triggers.
    // Logs the disconnect event with the socket ID.
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

module.exports = socketHandler;
