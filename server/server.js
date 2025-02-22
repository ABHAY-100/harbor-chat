const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

// In-memory mapping of user IDs to their socket info (including publicKey)
const users = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Client registers with their userId and publicKey
  socket.on("register", ({ userId, publicKey }) => {
    users[userId] = { socketId: socket.id, publicKey };
    socket.userId = userId; // store on socket for later use
    console.log(`Registered user: ${userId}`);
  });

  // Listen for a private message from a sender.
  // The sender sends: { to: recipientUserId, message: encryptedMessage }
  socket.on("private message", ({ to, message }) => {
    const recipient = to;
    console.log(recipient)
    if (recipient) {
      io.to(recipient.socketId).emit("private message", {
        from: socket.userId,
        message,
      });
      console.log(
        `Message from ${socket.userId} forwarded to ${to}: ${message}`
      );
    } else {
      console.log(`User ${to} not found or not connected.`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    if (socket.userId) {
      delete users[socket.userId];
    }
  });
});

const PORT = 5000;
server.listen(PORT, () =>
  console.log(`Socket.IO server running on http://localhost:${PORT}`)
);
