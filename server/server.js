const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" }, // Match your client's origin
});

// Store users: { [userId]: { socketId, publicKey } }
const users = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Register user with ID and publicKey
  socket.on("register", ({ userId, publicKey }) => {
    users[userId] = { socketId: socket.id, publicKey };
    socket.userId = userId; // Attach userId to socket
    console.log(`Registered user: ${userId}`);
  });

  // Handle private messages
  socket.on("private message", ({ to, message }) => {
    const recipient = users[to]; // Correct: Lookup in users map
    if (recipient) {
      io.to(recipient.socketId).emit("private message", {
        from: socket.userId,
        message,
      });
      console.log(`Message from ${socket.userId} to ${to}: ${message}`);
    } else {
      console.log(`User ${to} not found.`);
    }
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    if (socket.userId) delete users[socket.userId];
  });
});

const PORT = 5000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);