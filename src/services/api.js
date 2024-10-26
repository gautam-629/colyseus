// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerUser = async (userData) => axios.post(`${API_URL}/auth/register`, userData);
export const loginUser = async (userData) => axios.post(`${API_URL}/auth/login`, userData);
export const getMessages = async (senderId, receiverId) => axios.get(`${API_URL}/chat/${senderId}/${receiverId}`);
export const getConversations = async (userId) => axios.get(`${API_URL}/chat/conversations/${userId}`);
export const createConversation = async (conversationData) => axios.post(`${API_URL}/chat/conversation`, conversationData);
export const fetchUsers = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/users?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};


export const sendMessage = async (message) => {
    try {
        await axios.post(`/api/chat/send_message`, message);
    } catch (error) {
        console.error("Error sending message:", error);
    }
};