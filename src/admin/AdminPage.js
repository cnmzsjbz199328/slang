import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminPage.module.css'; // 导入模块化 CSS 文件
import config from '../config'; // Adjust the path to your config.js file
import SlangManager from '../components/SlangManage'; // 导入 SlangManager 组件
import AdminLogin from './AdminLogin'; // Adjust the path as necessary

const AdminPage = () => {
    const [registrations, setRegistrations] = useState([]);
    const [users, setUsers] = useState([]); // 新增状态来存储现有用户信息
    const [showPendingRegistrations, setShowPendingRegistrations] = useState(false); // 控制 Pending Registrations 的显示和隐藏
    const [showExistingUsers, setShowExistingUsers] = useState(false); // 控制 Existing Users 的显示和隐藏
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 控制是否显示登录页面

    useEffect(() => {
        const username = sessionStorage.getItem('username');
        const loginTime = sessionStorage.getItem('loginTime');
        const currentTime = new Date().getTime();
        const thirtyMinutes = 30 * 60 * 1000;

        if (username && loginTime && (currentTime - loginTime < thirtyMinutes)) {
            setIsLoggedIn(true);
        } else {
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('loginTime');
        }

        if (isLoggedIn) {
            fetchRegistrations();
            fetchUsers(); // 获取现有用户信息
        }
    }, [isLoggedIn]);

    const fetchRegistrations = async () => {
        try {
            const response = await axios.get(`${config.apiHost}/fetchRegistrations.php`);
            setRegistrations(response.data);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${config.apiHost}/fetchUsers.php`); // 获取现有用户信息的 API
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleApprove = async (id) => {
        try {
            const response = await axios.post(`${config.apiHost}/approveRegistration.php`, { id });
            if (response.data.success) {
                fetchRegistrations();
                fetchUsers(); // 更新用户信息
            } else {
                alert('Approval failed');
            }
        } catch (error) {
            console.error('Error approving registration:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            const response = await axios.post(`${config.apiHost}/rejectRegistration.php`, { id });
            if (response.data.success) {
                fetchRegistrations();
            } else {
                alert('Rejection failed');
            }
        } catch (error) {
            console.error('Error rejecting registration:', error);
        }
    };

    const handleRevertToRegistration = async (id) => {
        try {
            const response = await axios.post(`${config.apiHost}/revertToRegistration.php`, { id });
            if (response.data.success) {
                fetchUsers();
                fetchRegistrations(); // 更新注册信息
            } else {
                alert('Revert failed: ' + (response.data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error reverting user:', error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const response = await axios.post(`${config.apiHost}/deleteUser.php`, { id });
            if (response.data.success) {
                fetchUsers(); // 更新用户信息
            } else {
                alert('Deletion failed');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    return (
        <div>
            {!isLoggedIn ? (
                <AdminLogin show={!isLoggedIn} onClose={handleLoginSuccess} />
            ) : (
                <div className={styles.parentContainer}>
                    <div className={styles.container}>
                        <h1 className={styles.logo} onClick={() => window.location.href = '/'}>Australian Slang</h1>

                        <div className={styles.userManagementSection}>

                            <div className={styles.section}>
                                <h2 className={styles.h2} onClick={() => setShowPendingRegistrations(!showPendingRegistrations)}>
                                    Pending Registrations
                                </h2>
                                <ul className={`${styles.ul} ${showPendingRegistrations ? styles.expanded : ''}`}>
                                    {registrations.map(reg => (
                                        <li key={reg.id} className={styles.li}>
                                            <span>{reg.username}</span>
                                            <div>
                                                <button className={styles.ApproveButton} onClick={() => handleApprove(reg.id)}>Approve</button>
                                                <button className={`${styles.RejectButton} ${styles.reject}`} onClick={() => handleReject(reg.id)}>Reject</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.section}>
                                <h2 className={styles.h2} onClick={() => setShowExistingUsers(!showExistingUsers)}>
                                    Existing Users
                                </h2>
                                <ul className={`${styles.ul} ${showExistingUsers ? styles.expanded : ''}`}>
                                    {users.map(user => (
                                        <li key={user.id} className={styles.li}>
                                            <span>{user.username}</span>
                                            <div>
                                                <button className={styles.button} onClick={() => handleRevertToRegistration(user.id)}>Revert to Registration</button>
                                                <button className={`${styles.DeleteButton} ${styles.delete}`} onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <SlangManager
                        userType="admin"
                        sessionUserId={null}
                        filterLetter="" // 直接传递空字符串
                        searchTerm="" // 直接传递空字符串
                        filterType="Slang" // 直接传递字符串
                    />
                </div>
            )}
        </div>
    );
};

export default AdminPage;