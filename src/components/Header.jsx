// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Header.css'; // 스타일 파일을 임포트
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import { ChevronDown, ChevronRight } from 'lucide-react'; // 필요한 아이콘 추가
import { getMyEmailAndRole } from '../services/auth';
import { removeToken } from '../utils/tokenManager'; // 토큰 삭제 함수 임포트

const Header = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); // 드롭다운 상태 관리
    const [userInfo, setUserInfo] = useState({ email: '', role: '' }); // 사용자 정보 상태

    useEffect(() => {
        // API 호출하여 사용자 정보 가져오기
        const fetchUserInfo = async () => {
            try {
                const response = await getMyEmailAndRole();
                setUserInfo({
                    email: response.data.email,
                    role: response.data.role,
                });
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };

        fetchUserInfo();
    }, []);
    const handleTitleClick = () => {
        navigate('/main');
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen); // 드롭다운 열기/닫기
    };
    const handleLogout = () => {
        removeToken(); // 토큰 삭제
        navigate('/'); // 로그인 페이지로 리다이렉트
    };

    return (
        <div className="header">
            <h1 className="header-title" onClick={handleTitleClick}>
                GrouUP
            </h1>
            <div className="user-info">
                <div className="user-details">
                    <span className="user-name">{userInfo.email || 'Loading...'}</span>
                    <span className="user-role">{userInfo.role || 'Loading...'}</span>
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
                            <div className="dropdown-item" onClick={handleLogout}>
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
