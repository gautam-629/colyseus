// src/hooks/useChat.js
import { useState, useEffect, useCallback } from 'react';
import { Client } from 'colyseus.js';
import { messageService } from '../services/api';

const client = new Client('ws://localhost:3000');

export const useChat = () => {
    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);

    const fetchConversations = useCallback(async () => {
        try {
            const data = await messageService.getConversations();
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    }, []);

    const selectConversation = useCallback(async (conversation) => {
        setActiveConversation(conversation);
        try {
            const messages = await messageService.getMessages(conversation._id);
            setMessages(messages);

            if (room) {
                await room.leave();
            }

            const newRoom = await client.joinOrCreate('chat', { conversationId: conversation._id });
            setRoom(newRoom);

            newRoom.onMessage('message', (message) => {
                setMessages(prev => [...prev, message]);
            });
        } catch (error) {
            console.error('Error in selectConversation:', error);
        }
    }, [room]);

    const sendMessage = useCallback((content, userId) => {
        if (!content.trim() || !activeConversation) return;

        try {
            room.send('message', {
                conversationId: activeConversation._id,
                senderId: userId,
                content
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }, [room, activeConversation]);

    useEffect(() => {
        return () => {
            if (room) {
                room.leave();
            }
        };
    }, [room]);

    return {
        messages,
        conversations,
        activeConversation,
        fetchConversations,
        selectConversation,
        sendMessage
    };
};