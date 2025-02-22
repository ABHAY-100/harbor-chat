const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// Setup Express
const app = express();
app.use(cors());

// Create HTTP Server
const httpServer = createServer(app);

// Setup Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// WebSocket Logic
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join the room when client registers
    socket.on("register", (data) => {
        socket.join(data.roomId);
        console.log(`User ${data.userId} joined room ${data.roomId}`);
    });

    // Handle room-specific messages
    socket.on("room message", (data) => {
        console.log(`Message received in room ${data.roomId}: ${data.message}`);
        // Broadcast to all in the room except sender
        socket.to(data.roomId).emit("room message", {
            from: socket.id,
            message: data.message
        });
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