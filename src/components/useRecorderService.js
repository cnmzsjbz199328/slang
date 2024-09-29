import { useState, useEffect } from 'react';

const useRecorderService = () => {
    const [audioUrl, setAudioUrl] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState(null);

    useEffect(() => {
        if (!navigator.mediaDevices || !window.MediaRecorder) {
            console.error("Browser does not support audio recording.");
            return;
        }

        // 请求用户权限并获取音频流
        const initRecorder = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const newRecorder = new MediaRecorder(stream);
                let audioChunks = [];

                newRecorder.ondataavailable = e => {
                    audioChunks.push(e.data);
                };

                newRecorder.onstop = () => {
                    console.log('Audio chunks:', audioChunks); // 添加日志
                    if (audioChunks.length > 0) {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                        console.log('Audio Blob:', audioBlob); // 添加日志
                        const audioUrl = URL.createObjectURL(audioBlob);
                        setAudioUrl(audioUrl);
                        console.log('Generated audio URL:', audioUrl); // 添加日志
                    } else {
                        console.error('No audio data available');
                    }
                    audioChunks = []; // 清空数组以备下次录音
                };

                setRecorder(newRecorder);
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        };

        initRecorder();

        // 清理函数
        return () => {
            recorder?.stream.getTracks().forEach(track => track.stop());
        };
    }, [recorder?.stream]); // 添加 recorder?.stream 作为依赖项

    const startRecording = () => {
        if (recorder && recorder.state === 'inactive') {
            recorder.start();
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (recorder && recorder.state === 'recording') {
            recorder.stop();
            setIsRecording(false);
        }
    };

    return { audioUrl, isRecording, startRecording, stopRecording };
};

export default useRecorderService;