import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config'; // Import config
import './AdminLogin.css'; // Import CSS for styling

const AdminLogin = ({ show, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        loginUser();
    };

    const loginUser = () => {
        fetch(`${config.apiHost}/adminLogin.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || 'Network response was not ok'); });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const loginTime = new Date().getTime();
                sessionStorage.setItem('username', username); // 存储在会话中
                sessionStorage.setItem('loginTime', loginTime); // 存储登录时间
                onClose();
                navigate('/admin'); // Navigate to AdminPage
            } else {
                setError(data.message || 'Invalid username or password');
            }
        })
        .catch(error => {
            console.error('Login failed:', error);
            setError('An error occurred. Please try again.');
        });
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="error">{error}</p>}
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
};

export default AdminLogin;