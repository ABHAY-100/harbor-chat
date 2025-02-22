// hi
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

// WebSocket Logic
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("message", (msg) => {
        console.log(`Message received:${socket.id} ${msg}`);
        io.emit("message", msg);
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
