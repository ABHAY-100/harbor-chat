import { Server as HttpServer} from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponseServerIo } from "@/types/socket"; // We'll define this type below

import { NextApiRequest  } from "next";

export function handler(req:NextApiRequest , res:NextApiResponseServerIo)
{
    if(!res.socket.server.io){
        const httpServer: HttpServer = res.socket.server as any;
        const io = new SocketIOServer(httpServer, {
            path: "/api/socket_io",
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
    console.log(io)
    io.on("connection" , (socket)=>{
        console.log("User connected" , socket.id)
    })
    }

    

}
