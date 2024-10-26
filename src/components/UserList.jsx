// src/components/UserList.jsx
import React from 'react';

const UserList = ({ users, onSelectUser }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Registered Users</h2>
            <ul className="space-y-2">
                {users.map((user) => (
                    <li
                        key={user._id}
                        onClick={() => onSelectUser(user)}
                        className="p-3 bg-gray-100 rounded cursor-pointer hover:bg-indigo-100 transition"
                    >
                        {user.username}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
