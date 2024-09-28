import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContentItem from '../components/ContentItem';
import styles from './SlangManage.module.css';
import config from '../config';

const SlangManager = ({ userType, sessionUserId, filterLetter, searchTerm, filterType }) => {
    const [contentData, setContentData] = useState([]);
    const [error, setError] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({});
    const [searchInput, setSearchInput] = useState(searchTerm || '');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${config.apiHost}/getSlangs.php`);
                if (Array.isArray(response.data)) {
                    setContentData(response.data);
                } else {
                    setError('Data is not an array');
                }
            } catch (error) {
                setError('Error fetching data');
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    const filteredContent = contentData.filter(item => {
        if (userType === 'user' && item.contributor !== sessionUserId) {
            return false;
        }
        if (filterLetter) {
            const startsWithLetter = item.slang.toLowerCase().startsWith(filterLetter.toLowerCase());
            if (!startsWithLetter) return false;
        }
        if (searchInput) {
            let matchesSearch = false;
            switch (filterType) {
                case 'Slang':
                    matchesSearch = item.slang.toLowerCase().includes(searchInput.toLowerCase());
                    break;
                case 'Explanation':
                    matchesSearch = item.explanation.toLowerCase().includes(searchInput.toLowerCase());
                    break;
                case 'Contributor':
                    matchesSearch = item.contributor.toLowerCase().includes(searchInput.toLowerCase());
                    break;
                default:
                    matchesSearch = true;
            }
            if (!matchesSearch) return false;
        }
        return true;
    });

    const handleDeleteClick = (id) => {
        if (confirmDelete[id]) {
            handleDelete(id);
        } else {
            setConfirmDelete({ ...confirmDelete, [id]: true });
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.post(`${config.apiHost}/deleteSlang.php`, { id });
            setContentData(contentData.filter(item => item.id !== id));
            setConfirmDelete({ ...confirmDelete, [id]: false });
        } catch (error) {
            console.error('Error deleting entry:', error);
        }
    };

    return (
        <div className={styles['content-container']}>
            <div className={styles['search-bar']}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <div className={styles['title']}>
                    Slang Management
                </div>
            </div>
            <div className={styles['content-header']}>
                <span>ID</span>
                <span>Image</span>
                <span>Pronouncation</span>
                <span>Explanation</span>
                <span>Contributor</span>
                <span>Created Time</span>
                <span>Audio</span>
                <span>Actions</span>
            </div>
            <div className={styles['content-body']}>
                {filteredContent.map(item => (
                    <div key={item.id} className={styles['content-item']}>
                        <ContentItem
                            id={Number(item.id)}
                            imageSrc={`${config.apiHost}/${item.imageSrc}`}
                            slang={item.slang}
                            explanation={item.explanation}
                            audioSrc={`${config.apiHost}/${item.audioSrc}`}
                            contributor={item.contributor || 'Unknown'}
                            time={item.timestamp || new Date().toISOString()}
                        />
                        <div>
                            <button
                                type="button"  // 确保删除按钮的 type 属性设置为 button
                                className={`${styles['delete-button']} ${confirmDelete[item.id] ? styles['confirm-delete'] : ''}`}
                                onClick={() => handleDeleteClick(item.id)}
                            >
                                {confirmDelete[item.id] ? 'Sure?' : 'Delete'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SlangManager;