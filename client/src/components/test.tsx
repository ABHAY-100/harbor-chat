"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Connect to YOUR server
const socket: Socket = io("https://keyedin.onrender.com");

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [from, setFrom] = useState<string>("");
  const myUserId = "Sreyas";
  //const myPublicKey = "User1PublicKey";

  useEffect(() => {
    // Register on connect
    socket.emit("register", { userId: myUserId});

    // Handle incoming messages correctly
    socket.on("private message", (data: { from: string; message: string }) => {
      //setMessages((prev) => [...prev, data.message]);
      //setFrom(data.from);
      //console.log(`Received from ${data.from}: ${data.message}`);
    });

    return () => {
      socket.off("private message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      // Send to a VALID recipient (e.g., "user2")
      socket.emit("private message", { to: "Abhay", message });
      //setMessage("");
    }
  };

  return (
    <div>
      <h2>Chat (User: {myUserId})</h2>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>

      <div>
        <h3>Messages:</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
        {from && <p>Last message from: {from}</p>}
      </div>
    </div>
  );
}