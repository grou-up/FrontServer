import React, { useState } from 'react';
import '../styles/Totalsearchbar.css'; // 스타일을 위해 CSS 파일을 임포트합니다.

const Totalsearchbar = () => {
    const [activeButton, setActiveButton] = useState(null); // 클릭된 버튼 상태 관리

    const handleButtonClick = (buttonName) => {
        console.log(`${buttonName} 버튼 클릭됨`);
        setActiveButton(buttonName); // 클릭한 버튼의 이름 저장
    };

    return (
        <div className="my-component bg-white p-4 rounded-lg shadow-md"> {/* 흰색 배경, 패딩 및 그림자 추가 */}
            <div className="flex-container"> {/* 새로 추가된 flex-container */}
                <div className="left-buttons">
                    {['기본 통계', '옵션', '키워드', '제외 키워드', '입력자 관리'].map((buttonName) => (
                        <button
                            key={buttonName}
                            onClick={() => handleButtonClick(buttonName)}
                            className={activeButton === buttonName ? 'active' : ''} // 클릭된 버튼에 active 클래스 추가
                        >
                            {buttonName}
                        </button>
                    ))}
                </div>
                <div className="right-controls">
                    <select>
                        <option value="24">24년</option>
                        <option value="23">23년</option>
                        {/* 추가 옵션들 */}
                    </select>
                    <select>
                        <option value="12">12월</option>
                        {/* 추가 옵션들 */}
                    </select>
                    
                    <div className="button-container">
                        <button>7일</button>
                    </div>
                    <div className="button-container">
                        <button>14일</button>
                    </div>
                    <div className="button-container">
                        <button>30일</button>
                    </div>
                    
                    <input type="date" />
                    <span>~</span>
                    <input type="date" />
                </div>
            </div>
        </div>
    );
};

export default Totalsearchbar;
