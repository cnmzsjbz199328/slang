// src/components/AlphabetNavigation/AlphabetNavigation.js
import React from 'react';
import './AlphabetNavigation.css';

const AlphabetNavigation = ({ onLetterClick }) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const handleLetterClick = (letter) => {
        onLetterClick(letter); // 调用传递的 onLetterClick 方法
    };

    return (
        <div className="alphabet-navigation">
            {letters.map(letter => (
                <button
                    key={letter}
                    className="alphabet-button"
                    onClick={() => handleLetterClick(letter)}
                >
                    {letter}
                </button>
            ))}
        </div>
    );
};

export default AlphabetNavigation;