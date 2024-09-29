import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ReactMediaRecorder } from 'react-media-recorder';
import styles from './AddSlang.module.css'; // Import CSS module
import config from '../config'; // Import config
import SlangManager from '../components/SlangManage'; // 导入 SlangManager 组件
import LoginModal from '../components/LoginModal'; // 导入 LoginModal 组件

const AddSlang = () => {
    const [formData, setFormData] = useState({
        slang: '',
        explanation: '',
        image: null,
        audio: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [isImageGenerated, setIsImageGenerated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
    const [leftWidth, setLeftWidth] = useState(30); // 左侧宽度百分比
    const [isDragging, setIsDragging] = useState(false);
    const [, setFileName] = useState(''); // 用于存储文件名
    const [showLoginModal, setShowLoginModal] = useState(false); // 控制登录模态框的显示

    const fileInputRef = useRef(null); // 引用文件输入控件
    const audioContainerRef = useRef(null); // 引用音频容器
    const navigate = useNavigate(); // 使用 useNavigate 进行重定向

    useEffect(() => {
        const username = sessionStorage.getItem('username');
        if (!username) {
            navigate('/login'); // 重定向到登录页面
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files.length > 0) {
            const file = files[0];
            setFormData(prevState => ({
                ...prevState,
                [name]: file
            }));
            setImagePreview(URL.createObjectURL(file));
            setFileName(file.name); // 设置文件名
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleAudioStop = (blobUrl, blob) => {
        setFormData(prevState => ({
            ...prevState,
            audio: blob
        }));
        addAudioPreview(blob);
    };

    const addAudioPreview = (blob) => {
        const audioContainer = audioContainerRef.current;
        if (audioContainer) {
            audioContainer.innerHTML = ''; // 清空之前的音频预览
            const audio = document.createElement('audio');
            audio.setAttribute('controls', '');
            audio.src = window.URL.createObjectURL(blob);
            audioContainer.appendChild(audio);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsSubmitSuccessful(false);

        const data = new FormData();
        data.append('slang', formData.slang);
        data.append('explanation', formData.explanation);
        if (formData.image) {
            data.append('image', formData.image);
        }
        if (formData.audio) {
            data.append('audio', formData.audio);
        }

        const username = sessionStorage.getItem('username');
        if (username) {
            data.append('contributor', username);
        }

        try {
            console.log('Submitting form data:', data);
            const response = await axios.post(`${config.apiHost}/addSlang.php`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Response from server:', response.data);
            setIsSubmitSuccessful(true);
            // 按钮变灰并显示 "Done"
            setTimeout(() => {
                setIsSubmitSuccessful(false);
            }, 3000);

        } catch (error) {
            console.error('Error adding slang:', error);
            alert('Failed to submit: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGenerateImage = async () => {
        setIsGeneratingImage(true);
        setIsImageGenerated(false);
        try {
            console.log('Generating image with prompt:', formData.explanation);
            const response = await axios.post(`${config.apiHost}/generateImage.php`, {
                prompt: formData.explanation
            });
            const imageBlob = await fetch('data:image/png;base64,' + response.data).then(res => res.blob());
            const imageFile = new File([imageBlob], 'generated.png', { type: 'image/png' });
            setFormData(prevState => ({
                ...prevState,
                image: imageFile
            }));
            setImagePreview(URL.createObjectURL(imageFile));
            setIsImageGenerated(true);
            console.log('Generated image file:', imageFile);
        } catch (error) {
            console.error('Error generating image:', error);
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const newLeftWidth = (e.clientX / window.innerWidth) * 100;
            if (newLeftWidth > 10 && newLeftWidth < 90) {
                setLeftWidth(newLeftWidth);
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const username = sessionStorage.getItem('username'); // 获取 session 中的用户名

    return (
        <div className={styles['add-slang-container']} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <div className={styles['headerContainer']}>
                <h1 className={styles.logo} onClick={() => window.location.href = '/'}>Australian Slang</h1>
                <h2>Add New Slang</h2>
            </div>
            <form onSubmit={handleSubmit} className={styles['slang-form']}>
                <div className={styles['left-section']} style={{ width: `${leftWidth}%` }}>
                    <div className={styles['form-group']}>
                        <label>Pronunciation:</label>
                        <input type="text" name="slang" value={formData.slang} onChange={handleChange} className={styles['slang-input']} />
                    </div>
                    <div className={styles['form-group']}>
                        <label>Explanation:</label>
                        <textarea name="explanation" value={formData.explanation} onChange={handleChange} className={styles['explanation-input']} rows="4" />
                    </div>
                    <div className={styles['form-group']}>
                        <label>Audio:</label>
                        <ReactMediaRecorder
                            audio
                            onStop={handleAudioStop}
                            render={({ startRecording, stopRecording, status }) => (
                                <div>
                                    <button type="button" onClick={startRecording} style={{ marginRight: '10px' }}>Start Recording</button>
                                    <button type="button" onClick={stopRecording}>Stop Recording</button>
                                    <p>Status: {status}</p>
                                    <div ref={audioContainerRef}></div>
                                </div>
                            )}
                        />
                    </div>

                    <div className={styles['image-preview']}>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" />
                        ) : (
                            <span>Image preview will appear here</span>
                        )}
                    </div>
                    <div className={styles['button-group']}>
                        <button
                            type="button"
                            onClick={handleGenerateImage}
                            disabled={!formData.explanation || isGeneratingImage}
                            className={`${styles['generate-button']} ${!formData.explanation ? styles['disabled'] : ''} ${isImageGenerated ? styles['success'] : ''}`}
                        >
                            {isImageGenerated ? 'Well Done' : isGeneratingImage ? 'Generating...' : 'Generate Image'}
                        </button>
                        <div className={styles['custom-file-upload']}>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                                className={styles['upload-button']}
                                ref={fileInputRef} // 使用 useRef 引用文件输入控件
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()} // 使用 useRef 引用文件输入控件
                                className={styles['upload-button']}
                            >
                                Upload Image
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={`${styles['submit-button']} ${isSubmitting ? styles['disabled'] : ''} ${isSubmitSuccessful ? styles['success'] : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitSuccessful ? 'Well Done' : isSubmitting ? 'Submitting...' : 'Add Slang'}
                    </button>
                </div>
                <div className={styles['splitter']} onMouseDown={handleMouseDown}></div>
                <div className={styles['right-section']} style={{ width: `${100 - leftWidth}%` }}>
                    <SlangManager
                        userType="user"
                        sessionUserId={username} // 传递 session 中的用户名
                        filterLetter="" // 直接传递空字符串
                        searchTerm="" // 直接传递空字符串
                        filterType="Slang" // 直接传递字符串
                    />
                </div>
            </form>
            <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} /> {/* 显示登录模态框 */}
        </div>
    );
};

export default AddSlang;