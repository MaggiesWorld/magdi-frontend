import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chat.css";  // Ensure the CSS is imported

// Description: 
// Displays the conversation between the user and the assistant
// Inputs:
// User Message
// Return:
// None:

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [file, setFile] = useState(null);
    const chatContainerRef = useRef(null); // For auto-scrolling

    useEffect(() => {
    	if (chatContainerRef.current) {
        	chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    	}
    }, [messages]);

   /* Description:
      Handle file selection
      Inputs: 
      File events
      Return:
      None
   */ 

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

   /* Description:
      Upload the selected file to the backend
      Inputs: 
      File
      Return:
      None
   */ 

   const uploadFile = async () => {
    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post(
            "https://magdi-proxy.onrender.com/api/upload_document",  // ✅ Use proxy URL
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }  // ✅ Remove API Key
        );

        alert(response.data.message || "File uploaded successfully!");
    } catch (error) {
        console.error("Error uploading file:", error);
        alert("File upload failed.");
    }
};



    // Description:
    // Sends the user's message to the Assistant
    // Inputs:
    // None
    // Return:
    // None

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {

    	    console.log("Sending request to proxy...");

            const response = await axios.post(
    		"https://magdi-proxy.onrender.com/api/chat",
    		{ user_message: input },
            	{ headers: { 
                	"Content-Type": "application/json" 
            	} }
	    );

           console.log("Proxy Response:", response.data);

           if (!response.data || !response.data.response || !response.data.response.value) {
                throw new Error("Invalid response format from backend");
            }

            const botMessage = { 
            sender: "bot", 
            text: response.data.response.value ?? "No response received" 
           };

           setMessages((prevMessages) => [...prevMessages, botMessage]);

        } catch (error) {
            console.error("Error communicating with proxy:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "Error: Unable to get response from MagDi." }
            ]);
        }
        setInput("");
    };

    // Description:
    // HTML to display the Assistant UI
    // Inputs:
    // None
    // Return:
    // None

    return (
            <div className="chat-container">
            <h3>Hi!  I'm MagDi.  Your personal QA assistant.</h3>

	    {/* Chat Display */}
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <strong>{msg.sender === "user" ? "You" : "MagDi"}:</strong> {msg.text}
                    </div>
                ))}
                <div ref={chatContainerRef} />
            </div>

            {/* File Upload Section */}
            <div className="file-upload-container">
                <input type="file" onChange={handleFileChange} className="file-input" />
                <button onClick={uploadFile} className="upload-button">
                    Upload Document
                </button>
            </div>

            {/* ✅ User Input for Chat */}
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
