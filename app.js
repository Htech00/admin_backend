// server.js
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");

// routes
const propertyRoutes = require("./routes/propertyRoute");
const authRoutes = require("./routes/authRoute");
const adminRoutes = require("./routes/adminRoute");
const socketHandler = require("./utils/socket");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const server = http.createServer(app);

// ====== Allowed Origins ======
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://admin-backend-rrt2.onrender.com", // production frontend
];

// ====== Setup Socket.IO with proper CORS ======
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true, // allow cookies/headers if needed
  },
});

// // Attach io to express app (so controllers can use it)
// app.set("io", io);

// Attach io to req for controllers (so chatController can emit too)
app.use((req, res, next) => {
  req.io = io;
  next();
});

const port = process.env.PORT || 5000;

// ====== Middlewares ======
app.use(cors())
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

app.use(express.json());

// ====== Routes ======
app.use("/api/property", propertyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", adminRoutes);
app.use("/chat", chatRoutes);

// ====== Uploads (static folder) ======
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// ====== Socket.IO Integration ======
socketHandler(io);

// ====== Start Server ======
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
