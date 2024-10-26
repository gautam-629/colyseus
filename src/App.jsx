import React, { useState, useEffect, useRef } from 'react';
import { Client } from 'colyseus.js';
import axios from 'axios';

// Initialize Colyseus client
const client = new Client('ws://localhost:3000');

const ChatApp = () => {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [room, setRoom] = useState(null);
  const messagesEndRef = useRef(null);
 const api='http://localhost:3000'
  // Auth functions
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${api}/api/auth/login`, { email, password });
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      fetchConversations();
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(`${api}/api/auth/register`, { username, email, password });
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      fetchConversations();
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${api}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Search users
  const searchUsers = async (query) => {
    try {
      const response = await axios.get(`${api}/api/users/search?query=${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Handle conversation selection
  const selectConversation = async (conversation) => {
    setActiveConversation(conversation);
    try {
      const response = await axios.get(`${api}/api/messages/conversations/${conversation._id}/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages(response.data);
      
      // Leave previous room if exists
      if (room) {
        room.leave();
      }
      
      // Join new room
      const newRoom = await client.joinOrCreate('chat', { conversationId: conversation._id });
      setRoom(newRoom);
      
      // Listen for new messages
      newRoom.onMessage('message', (message) => {
        setMessages(prev => [...prev, message]);
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!messageInput.trim() || !activeConversation) return;

    try {
      room.send('message', {
        conversationId: activeConversation._id,
        senderId: user.id,
        content: messageInput
      });
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Start new conversation
  const startConversation = async (participantId) => {
    try {
      const response = await axios.post(`${api}/api/messages/conversations`, 
        { participantId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      await fetchConversations();
      setSearchQuery('');
      setSearchResults([]);
      selectConversation(response.data);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auth Components
  const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (isLogin) {
        login(email, password);
      } else {
        register(username, email, password);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              {isLogin ? 'Sign in to your account' : 'Create new account'}
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required={!isLogin}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLogin ? 'Sign in' : 'Sign up'}
              </button>
            </div>
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-500"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ConversationList = () => (
    <div className="w-64 border-r h-full overflow-y-auto">
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-2 border rounded"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            searchUsers(e.target.value);
          }}
        />
      </div>
      
      {searchQuery && searchResults.map(user => (
        <div
          key={user._id}
          className="p-4 hover:bg-gray-100 cursor-pointer"
          onClick={() => startConversation(user._id)}
        >
          {user.username}
        </div>
      ))}
      
      {!searchQuery && conversations.map(conv => (
        <div
          key={conv._id}
          className={`p-4 cursor-pointer ${activeConversation?._id === conv._id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          onClick={() => selectConversation(conv)}
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
  console.log({messages})
  console.log({user})
  const MessageList = () => (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        { Array.isArray(messages) && messages.length>0 && messages.map(message => (
          <div
            key={message._id}
            className={`mb-4 ${message.sender._id === user.id ? 'text-right' : ''}`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.sender._id === user.id
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
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="flex h-screen">
      <ConversationList />
      {activeConversation ? (
        <MessageList />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a conversation to start chatting
        </div>
      )}
    </div>
  );
};

export default ChatApp;