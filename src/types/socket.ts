import { Server as SocketIOServer } from "socket.io";
import type { NextApiResponse } from "next";

export type NextApiResponseServerIo = NextApiResponse & {
    socket: {
        server: {
            io?: SocketIOServer;
        };
    };
};