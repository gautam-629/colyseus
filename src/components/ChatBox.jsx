// src/components/ChatBox.jsx
import React, { useState } from 'react';
import { sendMessage } from '../services/api';

const ChatBox = ({ selectedUser, currentUserId }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSendMessage = async () => {
        if (message.trim() === '') return;

        const newMessage = {
            senderId: currentUserId,
            receiverId: selectedUser._id,
            content: message,
        };

        // Send message to backend
        await sendMessage(newMessage);

        // Update local state
        setMessages([...messages, newMessage]);
        setMessage('');
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg h-full flex flex-col">
            <h3 className="text-lg font-bold mb-4">Chat with {selectedUser.username}</h3>
            <div className="flex-1 overflow-y-auto mb-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`p-2 ${msg.senderId === currentUserId ? 'text-right' : 'text-left'}`}>
                        <p className="inline-block bg-indigo-100 p-2 rounded">
                            {msg.content}
                        </p>
                    </div>
                ))}
            </div>
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Type a message..."
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-500 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
