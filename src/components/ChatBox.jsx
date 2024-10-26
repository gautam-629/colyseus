// src/components/ChatBox.jsx
import React, { useState, useEffect } from 'react';
import socket from '../socket';
import { getMessages } from '../services/api';

const ChatBox = ({ userId, receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        socket.emit('join_chat', userId + receiverId);
        socket.on('receive_message', (message) => setMessages((prev) => [...prev, message]));

        const fetchMessages = async () => {
            const response = await getMessages(userId, receiverId);
            setMessages(response.data);
        };

        fetchMessages();

        return () => socket.off('receive_message');
    }, [userId, receiverId]);

    const sendMessage = () => {
        const messageData = { room: userId + receiverId, senderId: userId, receiverId, message: newMessage };
        socket.emit('send_message', messageData);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-full p-4 bg-white shadow-lg rounded-lg max-w-xl w-full mx-auto mt-8">
            <div className="overflow-y-auto mb-4 h-64">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-2 mb-2 rounded-lg max-w-xs ${
                            msg.senderId === userId ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-800 self-start'
                        }`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className="flex items-center">
                <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                    className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
