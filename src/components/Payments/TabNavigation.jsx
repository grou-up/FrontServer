// TabNavigation.js (예시)
import React, { useState } from 'react';
import '../../styles/payments/TabNavigation.css'

const TabNavigation = ({ onComponentChange }) => {
    const [activeTab, setActiveTab] = useState('UseHistory'); // 초기 탭 설정

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        onComponentChange(tabName); // 부모 컴포넌트에 탭 변경 알림
    };

    return (
        <div>
            <div className='payment_buttons'>
                <button
                    className={`payment_button ${activeTab === 'UseHistory' ? 'active' : ''}`}
                    onClick={() => handleTabClick('UseHistory')}
                >
                    사용내역
                </button>
                <button
                    className={`payment_button ${activeTab === 'BuyHistory' ? 'active' : ''}`}
                    onClick={() => handleTabClick('BuyHistory')}
                >
                    구매 및 환불 내역
                </button>
            </div>
        </div>
    );
};

export default TabNavigation;
