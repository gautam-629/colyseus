// src/pages/ChatRoom.jsx
import React, { useState } from 'react';
import ChatBox from '../components/ChatBox';

const ChatRoom = ({ userId }) => {
    const [receiverId, setReceiverId] = useState('');

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-teal-500 to-blue-500">
            <div className="w-full max-w-md">
                <input
                    type="text"
                    placeholder="Enter Receiver ID"
                    className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-teal-200"
                    onChange={(e) => setReceiverId(e.target.value)}
                />
                {receiverId && <ChatBox userId={userId} receiverId={receiverId} />}
            </div>
        </div>
    );
};

export default ChatRoom;
