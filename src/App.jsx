// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ChatRoom from './pages/ChatRoom';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

    return (
        <Router>
            <Routes>
                <Route path="/" element={!token ? <Login setToken={setToken} /> : <ChatRoom userId={userId} />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;
