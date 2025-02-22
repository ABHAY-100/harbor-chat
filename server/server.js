const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// Setup Express
const app = express();
app.use(cors());

// Create HTTP Server for WebSockets
const httpServer = createServer(app);

// Setup Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for a user joining a room
    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
        // Optionally, notify others in the room
        socket.to(room).emit("notification", `User ${socket.id} has joined.`);
    });

    // Listen for room-specific messages
    socket.on("roomMessage", ({ room, msg }) => {
        // Since we're using PGP encryption, 'msg' should already be encrypted on the client side.
        console.log(`Encrypted message in room ${room} from ${socket.id}: ${msg}`);
        // Relay the encrypted message to everyone else in the room
        socket.to(room).emit("roomMessage", { sender: socket.id, msg });
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start Server
const PORT = 5000;
httpServer.listen(PORT, () => {
    console.log(`WebSocket server running on http://localhost:${PORT}`);
});
