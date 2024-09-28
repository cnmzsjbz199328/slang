import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContentItem from './ContentItem';
import styles from './Home.module.css';
import config from '../config'; // Adjust the path to your config.js file

const Home = ({ filterLetter, searchTerm, filterType }) => {
    const [contentData, setContentData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${config.apiHost}/getSlangs.php`);
                if (Array.isArray(response.data)) {
                    setContentData(response.data);
                } else {
                    setError('Data is not an array');
                    console.error('Data is not an array:', response.data);
                }
            } catch (error) {
                setError('Error fetching data');
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    const filteredContent = contentData.filter(item => {
        if (filterLetter) {
            return item.slang.toLowerCase().startsWith(filterLetter.toLowerCase());
        }
        if (searchTerm) {
            switch (filterType) {
                case 'Slang':
                    return item.slang.toLowerCase().includes(searchTerm.toLowerCase());
                case 'Explanation':
                    return item.explanation.toLowerCase().includes(searchTerm.toLowerCase());
                case 'Contributor':
                    return item.contributor.toLowerCase().includes(searchTerm.toLowerCase());
                default:
                    return true;
            }
        }
        return true;
    });

    return (
        <div className={styles['content-container']}>
            <div className={styles['content-header']}>
                <span>ID</span>
                <span>Image</span>
                <span>Pronouncation</span>
                <span>Explanation</span>
                <span>Contributor</span>
                <span>Created Time</span>
                <span>Audio</span>
            </div>
            <div className={styles['content-body']}>
                {filteredContent.map(item => (
                    <ContentItem
                        key={item.id}
                        id={Number(item.id)}
                        imageSrc={`${config.apiHost}/${item.imageSrc}`}
                        slang={item.slang}
                        explanation={item.explanation}
                        audioSrc={`${config.apiHost}/${item.audioSrc}`}
                        contributor={item.contributor || 'Unknown'}
                        time={item.timestamp || new Date().toISOString()}
                        className={styles['content-item']}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;