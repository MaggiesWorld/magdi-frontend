import React, { useState } from "react";
import axios from "axios";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages([...messages, userMessage]);

        try {
            const response = await axios.post("https://magdi-backend.onrender.com/chat", {
                message: input,
            });

            const botMessage = { sender: "bot", text: response.data.response };
            setMessages([...messages, userMessage, botMessage]);
        } catch (error) {
            console.error("Error communicating with backend:", error);
        }

        setInput("");
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h2>Chat with MagDi</h2>
            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    height: "300px",
                    overflowY: "auto",
                    marginBottom: "10px",
                }}
            >
                {messages.map((msg, index) => (
                    <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
                        <strong>{msg.sender === "user" ? "You" : "MagDi"}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                style={{ width: "80%", padding: "8px" }}
            />
            <button onClick={sendMessage} style={{ padding: "8px", marginLeft: "5px" }}>
                Send
            </button>
        </div>
    );
};

export default Chat;
