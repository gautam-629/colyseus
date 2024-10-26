// src/components/MessageList.js
import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const MessageList = ({ messages, onSendMessage }) => {
    const { user } = useAuth();
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (messageInput.trim()) {
            onSendMessage(messageInput, user.id);
            setMessageInput('');
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map(message => (
                    <div
                        key={message._id}
                        className={`mb-4 ${message.sender._id === user.id ? 'text-right' : ''}`}
                    >
                        <div
                            className={`inline-block p-2 rounded-lg ${message.sender._id === user.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200'
                                }`}
                        >
                            {message.content}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {new Date(message.createdAt).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        className="flex-1 p-2 border rounded"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleSend}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};