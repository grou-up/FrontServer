// src/components/Header.jsx
import React, { useState } from 'react';
import '../styles/Header.css'; // 스타일 파일을 임포트
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import { ChevronDown, ChevronRight } from 'lucide-react'; // 필요한 아이콘 추가

const Header = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); // 드롭다운 상태 관리

    const handleTitleClick = () => {
        navigate('/main');
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen); // 드롭다운 열기/닫기
    };

    return (
        <div className="header">
            <h1 className="header-title" onClick={handleTitleClick}>
                GrouUP
            </h1>
            <div className="user-info">
                <div className="user-details">
                    <span className="user-name">Moni Roy</span>
                    <span className="user-role">Admin</span>
                </div>
                <div className="dropdown">
                    <button className="dropdown-button" onClick={toggleDropdown}>
                        {isOpen ? <ChevronDown /> : <ChevronRight />}
                    </button>
                    {isOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-item" onClick={() => navigate('/mypage')}>
                                마이페이지
                            </div>
                            <div className="dropdown-item" onClick={() => navigate('/logout')}>
                                로그아웃
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
