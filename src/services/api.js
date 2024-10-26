// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/api/auth/login', { email, password });
        return response.data;
    },

    register: async (username, email, password) => {
        const response = await api.post('/api/auth/register', { username, email, password });
        return response.data;
    },
};

export const messageService = {
    getConversations: async () => {
        const response = await api.get('/api/messages/conversations');
        return response.data;
    },

    getMessages: async (conversationId) => {
        const response = await api.get(`/api/messages/conversations/${conversationId}/messages`);
        return response.data;
    },

    createConversation: async (participantId) => {
        const response = await api.post('/api/messages/conversations', { participantId });
        return response.data;
    },
};

export const userService = {
    searchUsers: async (query) => {
        const response = await api.get(`/api/users/search?query=${query}`);
        return response.data;
    },
};
