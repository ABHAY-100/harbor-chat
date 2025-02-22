import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types/socket"; // Ensure this type is defined

export default function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if (!res.socket.server.io) {
        const httpServer = res.socket.server as HttpServer;
        const io = new SocketIOServer(httpServer, {
            path: "/api/socket_io",
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });

        io.on("connection", (socket) => {
            console.log("User connected", socket.id);
        });

        res.socket.server.io = io; // Attach `io` instance to prevent reinitialization
    }

    res.end(); // Properly terminate response
}
