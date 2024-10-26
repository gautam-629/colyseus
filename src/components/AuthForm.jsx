// src/components/AuthForm.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';

export const AuthForm = () => {
    const { setUser } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { email, password, username } = formData;
            const response = isLogin
                ? await authService.login(email, password)
                : await authService.register(username, email, password);

            setUser(response.user);
            localStorage.setItem('token', response.token);
        } catch (error) {
            console.error('Auth error:', error);
            alert(error.response?.data?.error || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    {isLogin ? 'Sign in to your account' : 'Create new account'}
                </h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            type="text"
                            required={!isLogin}
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    )}
                    <input
                        type="email"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        type="password"
                        required
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {isLogin ? 'Sign in' : 'Sign up'}
                    </button>
                    <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-500"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
};