import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config'; // Import config
import './LoginModal.css';

const LoginModal = ({ show, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        if (isRegistering) {
            registerUser();
        } else {
            loginUser();
        }
    };

    const loginUser = () => {
        fetch(`${config.apiHost}/login.php`, {
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
                sessionStorage.setItem('username', username); // 存储在会话中
                onClose();
                navigate('/add-slang'); // Navigate to AddSlang page
            } else {
                alert(data.message || 'Invalid username or password');
            }
        })
        .catch(error => console.error('Login failed:', error));
    };

    const registerUser = () => {
        if (email !== confirmEmail) {
            alert('Emails do not match');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        fetch(`${config.apiHost}/register.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Registration request submitted. Awaiting admin approval.');
                onClose();
            } else {
                alert('Registration failed: ' + data.error);
            }
        })
        .catch(error => console.error('Registration failed:', error));
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{isRegistering ? 'Register' : 'Login'}</h2>
                {isRegistering && (
                    <>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Confirm Email"
                            value={confirmEmail}
                            onChange={(e) => setConfirmEmail(e.target.value)}
                        />
                    </>
                )}
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
                {isRegistering && (
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                )}
                <button onClick={handleLogin}>{isRegistering ? 'Register' : 'Login'}</button>
                <button onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? 'Switch to Login' : 'Switch to Register'}
                </button>
            </div>
        </div>
    );
};

export default LoginModal;