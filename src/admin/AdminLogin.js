import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config'; // 导入配置文件，包含API路径
import './AdminLogin.css'; // 导入样式文件

const AdminLogin = ({ show, onClose }) => {
    const [username, setUsername] = useState(''); // 用户名输入状态
    const [password, setPassword] = useState(''); // 密码输入状态
    const [error, setError] = useState(''); // 错误信息状态
    const navigate = useNavigate(); // 路由导航函数

    // 成功登录处理函数
    const handleLoginSuccess = () => {
        const loginTime = new Date().getTime();
        sessionStorage.setItem('username', username); // 存储用户名到sessionStorage
        sessionStorage.setItem('loginTime', loginTime); // 存储登录时间到sessionStorage
        onClose(); // 成功登录后调用 onClose
        navigate('/admin'); // 导航到管理员页面
    };

    // 登录用户
    const loginUser = () => {
        fetch(`${config.apiHost}/adminLogin.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                handleLoginSuccess(); // 成功时调用
            } else {
                setError(data.message || 'Invalid username or password');
                // 登录失败，清除sessionStorage中的数据
                sessionStorage.removeItem('username');
                sessionStorage.removeItem('loginTime');
            }
        })
        .catch(error => {
            console.error('Login failed:', error);
            setError('An error occurred. Please try again.');
            // 发生错误时，也应清除sessionStorage中的数据
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('loginTime');
        });
    };

    // 如果不显示登录窗口，则不渲染组件
    if (!show) {
        return null;
    }

    // 渲染登录界面
    return (
        <div className="modal-overlay" onClick={() => { /* 什么都不做，防止点击外部关闭 */ }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} // 更新用户名
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // 更新密码
                />
                {error && <p className="error">{error}</p>} 
                <button onClick={loginUser}>Login</button> 
            </div>
        </div>
    );
};

export default AdminLogin;
