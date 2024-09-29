// src/components/SearchNavbar/SearchNavbar.js
import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './SearchNavbar.css';
import LoginModal from './LoginModal';

const SearchNavbar = ({ onSearch }) => {
    const [filterType, setFilterType] = useState('Slang');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { transcript, listening, resetTranscript } = useSpeechRecognition();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Search Term:', transcript);
        console.log('Filter Type:', filterType); // 检查过滤类型是否正确
        onSearch(transcript, filterType);
    };

    const handleVoiceInput = () => {
        if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
            alert('Your browser does not support speech recognition. Please use a different browser.');
            return;
        }

        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true, language: 'en-AU' });
        }
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
                    value={transcript}
                    onChange={(e) => resetTranscript(e.target.value)}
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
                    {listening ? 'Listening...' : '🎤'}
                </button>
                <button type="submit" className="search-button">Search</button>
            </form>
            <button onClick={() => setShowLoginModal(true)} className="join-us-button">Join Us</button>
            <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </nav>
    );
};

export default SearchNavbar;