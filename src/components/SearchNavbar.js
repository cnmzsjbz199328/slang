// src/components/SearchNavbar/SearchNavbar.js
import React, { useState } from 'react';
import './SearchNavbar.css';
import LoginModal from './LoginModal';

const SearchNavbar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Slang');
    const [isListening, setIsListening] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Search Term:', searchTerm);
        console.log('Filter Type:', filterType); // 检查过滤类型是否正确
        onSearch(searchTerm, filterType);
    };
    
    const handleVoiceInput = () => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-AU';
        recognition.onresult = (event) => {
            setSearchTerm(event.results[0][0].transcript);
            onSearch(event.results[0][0].transcript, filterType);
        };
        recognition.start();
        setIsListening(true);
        recognition.onend = () => setIsListening(false);
    };

    return (
        <nav className="search-navbar">
            <div className="logo-title">
                <h1 className="title">Australian Slang</h1>
            </div>
            <form className="search-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search Slang here..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="filter-select"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="Slang">Slang</option>
                    <option value="Explanation">Explanation</option>
                    <option value="Contributor">Contributor</option>
                </select>
                <button type="button" className="voice-button" onClick={handleVoiceInput}>
                    {isListening ? 'Listening...' : '🎤'}
                </button>
                <button type="submit" className="search-button">Search</button>
            </form>
            <button onClick={() => setShowLoginModal(true)} className="join-us-button">Join Us</button>
            <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </nav>
    );
};

export default SearchNavbar;