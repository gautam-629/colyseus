// src/components/ConversationList.js
import React, { useState } from 'react';
import { userService, messageService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const ConversationList = ({
    conversations,
    activeConversation,
    onSelectConversation,
    onConversationCreate
}) => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim()) {
            try {
                const results = await userService.searchUsers(query);
                setSearchResults(results);
            } catch (error) {
                console.error('Error searching users:', error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleStartConversation = async (participantId) => {
        try {
            const conversation = await messageService.createConversation(participantId);
            setSearchQuery('');
            setSearchResults([]);
            onConversationCreate(conversation);
        } catch (error) {
            console.error('Error starting conversation:', error);
        }
    };

    return (
        <div className="w-64 border-r h-full overflow-y-auto">
            <div className="p-4 border-b">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full p-2 border rounded"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            {searchQuery && searchResults.map(searchUser => (
                <div
                    key={searchUser._id}
                    className="p-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleStartConversation(searchUser._id)}
                >
                    {searchUser.username}
                </div>
            ))}

            {!searchQuery && conversations.map(conv => (
                <div
                    key={conv._id}
                    className={`p-4 cursor-pointer ${activeConversation?._id === conv._id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                    onClick={() => onSelectConversation(conv)}
                >
                    <div className="font-semibold">
                        {conv.participants.find(p => p._id !== user.id)?.username}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                        {conv.lastMessage?.content}
                    </div>
                </div>
            ))}
        </div>
    );
};
