import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ContentItem.module.css';

const ContentItem = ({ id, imageSrc, slang, explanation, audioSrc, contributor, time }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleAudioToggle = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };
    let absoluteAudioSrc = audioSrc.replace('api/../', '');
    return (
        <div className={styles['content-item']}>
            <div className={styles['content-item-id']}>{id}</div>
            <div className={styles['content-item-image']}>
                <img src={imageSrc} alt={`Slang ${id}`} referrerPolicy="no-referrer" />
            </div>
            <div className={styles['content-item-slang']}>{slang}</div>
            <div className={styles['content-item-explanation']}>{explanation}</div>
            <div className={styles['content-item-contributor']}>{contributor}</div>
            <div className={styles['content-item-time']}>{new Date(time).toLocaleString()}</div>
            <div className={styles['content-item-audio']}>
                <button onClick={handleAudioToggle}>
                    {isPlaying ? '⏸️' : '🔊'}
                </button>
                <audio ref={audioRef} src={absoluteAudioSrc} />
            </div>
        </div>
    );
};

ContentItem.propTypes = {
    id: PropTypes.number.isRequired,
    imageSrc: PropTypes.string.isRequired,
    slang: PropTypes.string.isRequired,
    explanation: PropTypes.string.isRequired,
    audioSrc: PropTypes.string.isRequired,
    contributor: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
};

export default ContentItem;