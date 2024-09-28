import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AlphabetNavigation from './components/AlphabetNavigation';
import SearchNavbar from './components/SearchNavbar';
import Home from './components/Home';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import AddSlang from './backstage/AddSlang';
import AdminPage from './admin/AdminPage'; // 确保路径正确
import './App.css';

function App() {
    const [filterLetter, setFilterLetter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Slang'); // 新增状态

    const handleLetterClick = (letter) => {
        setFilterLetter(letter);
        setSearchTerm(''); // 清除搜索
        console.log(`选择的字母: ${letter}`);
    };

    const handleSearch = (term, type) => {
        setSearchTerm(term);
        setFilterType(type); // 设置过滤类型
        setFilterLetter(''); // 清除字母过滤
        console.log(`搜索词: ${term}, 过滤类型: ${type}`);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <div className="App">
                        <SearchNavbar onSearch={handleSearch} />
                        <div className="content-both-container">
                            <AlphabetNavigation onLetterClick={handleLetterClick} />
                            <Home filterLetter={filterLetter} searchTerm={searchTerm} filterType={filterType} /> {/* 传递 filterType */}
                        </div>
                        <Footer />
                    </div>
                } />
                <Route path="/login" element={<LoginModal show={true} onClose={() => {}} />} />
                <Route path="/add-slang" element={<AddSlang />} />
                <Route path="/admin" element={<AdminPage />} /> {/* 添加 AdminPage 路由 */}
            </Routes>
        </Router>
    );
}

export default App;