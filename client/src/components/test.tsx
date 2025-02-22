"use client"
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:5000");

export default function Chat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const [from, setFrom] = useState<string>();
    const [messagesUser2, setMessagesUser2] = useState<string>();
    const myUserId = "user1";
    const myPublicKey = "User1PublicKey";    // used by others to encrypt messages to you
    const myPrivateKey = "User1PrivateKey";  // used to decrypt received messages
    
    socket.emit("register" , { userId: myUserId, publicKey: myPublicKey })
    useEffect(() => {
        socket.on("private message", (from : string , message: string) => {
            setMessages((prev) => [...prev, message]);
            console.log(`recieveed from ${from}`)
            setFrom(from)
            setMessagesUser2(message)
        });

        return () => {
            socket.off("private message");
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("private message", {to : "Abhay" , message : message});
            setMessage("");
        console.log(from)
        }
    };

    return (
        <div>
            <h2>Chat</h2>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage} >Send</button>
        
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
                

            </ul>
            <p>{from} {messagesUser2}</p>
        </div>
    );
}
