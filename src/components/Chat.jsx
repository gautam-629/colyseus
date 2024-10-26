// src/components/Chat.jsx
import React, { useEffect, useState } from 'react';
import UserList from './UserList';
import ChatBox from './ChatBox';
import { fetchUsers } from '../services/api';

const Chat = ({ currentUserId }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Fetch users on component mount
    useEffect(() => {
        const getUsers = async () => {
            const userList = await fetchUsers(currentUserId);
            setUsers(userList);
        };
        getUsers();
    }, [currentUserId]);

    // Function to handle user selection
    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    return (
        <div className="flex flex-col md:flex-row p-6 space-y-4 md:space-x-4">
            {/* Sidebar with user list */}
            <div className="w-full md:w-1/3">
                <UserList users={users} onSelectUser={handleUserSelect} />
            </div>
            
            {/* Chat box area */}
            <div className="w-full md:w-2/3">
                {selectedUser ? (
                    <ChatBox selectedUser={selectedUser} currentUserId={currentUserId} />
                ) : (
                    <p className="text-center text-gray-600">Select a user to start a chat.</p>
                )}
            </div>
        </div>
    );
};

export default Chat;
