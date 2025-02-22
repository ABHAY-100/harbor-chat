"use client"
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    path: "/api/socket_io",
});

export default function ChatComponent() {
    const [messages, setMessages] = useState<string[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        socket.on("message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("message");
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("message", message);
            setMessage("");
        }
    };

    return (
        <div>
            <h2>PGP Chat</h2>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}
