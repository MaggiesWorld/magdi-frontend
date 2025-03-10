import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chat.css";  // Ensure the CSS is imported

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatContainerRef = useRef(null); // For auto-scrolling

    useEffect(() => {
    	if (chatContainerRef.current) {
        	chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    	}
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {

    	    console.log("Sending request with headers:", {
           	"X_API_KEY": process.env.REACT_APP_X_API_KEY, // Replace with secure method if needed
            	"Content-Type": "application/json"
     	    });

            const response = await axios.post(
    		"https://magdi-proxy.onrender.com/chat",
    		{ user_message: input },
            	{ headers: { 
                	"X_API_KEY": process.env.REACT_APP_X_API_KEY, 
                	"Content-Type": "application/json" 
            	} }
	    );
	

           if (!response.data || !response.data.response || !response.data.response.value) {
                throw new Error("Invalid response format from backend");
            }

            const botMessage = { 
            sender: "bot", 
            text: response.data.response.value ?? "No response received" 
           };

           setMessages((prevMessages) => [...prevMessages, botMessage]);

        } catch (error) {
            console.error("Error communicating with backend:", error);
            setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: "Error: Unable to get response from MagDi." }]);
        }

        setInput("");
    };

    return (
            <div className="chat-container">
            <h3>Hi!  I'm MagDi.  Your personal QA assistant.</h3>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <strong>{msg.sender === "user" ? "You" : "MagDi"}:</strong> {msg.text}
                    </div>
                ))}
                <div ref={chatContainerRef} />
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="chat-input"
                />
                <button onClick={sendMessage} className="send-button">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
