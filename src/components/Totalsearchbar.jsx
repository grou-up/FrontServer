import React, { useState } from 'react';
import '../styles/Totalsearchbar.css'; // 스타일을 위해 CSS 파일을 임포트합니다.
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Totalsearchbar = ({ onComponentChange, onSearch }) => { // 부모 컴포넌트에서 전달받을 prop 추가
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // 어제 날짜 계산

    const [activeButton, setActiveButton] = useState(null); // 클릭된 버튼 상태 관리
    const [startDate, setStartDate] = useState(yesterday); // 시작 날짜
    const [endDate, setEndDate] = useState(yesterday); // 종료 날짜

    const handleButtonClick = (buttonName) => {
        console.log(`${buttonName} 버튼 클릭됨`);
        setActiveButton(buttonName); // 클릭한 버튼의 이름 저장

        // 버튼에 따라 특정 컴포넌트를 활성화
        switch (buttonName) {
            case '기본 통계':
                // onComponentChange('component1');
                break;
            case '옵션':
                onComponentChange('CampaignOptionDetailsComponent');
                break;
            case '키워드':
                onComponentChange('Keywordcomponent');
                break;
            case '제외 키워드':
                // onComponentChange('component4');
                break;
            case '입력자 관리':
                // onComponentChange('component5');
                break;
            default:
                onComponentChange(null);
                break;
        }
    };
    const handleSearch = () => {

        const formattedStartDate = startDate.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
        const formattedEndDate = endDate.toISOString().split("T")[0];   // YYYY-MM-DD 형식으로 변환

        if (typeof onSearch === "function") {
            console.log("Calling onSearch with:", formattedStartDate, formattedEndDate);
            onSearch(formattedStartDate, formattedEndDate); // 포맷팅된 날짜 전달
        } else {
            console.error("onSearch prop이 전달되지 않았거나 함수가 아닙니다.");
        }
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
                    <div className="right-controls">
                        <div className="datepicker-container">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="yyyy-MM-dd"
                                maxDate={new Date()} // 오늘까지 선택 가능
                            />
                        </div>
                        <div className="datepicker-container">
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="yyyy-MM-dd"
                                minDate={startDate} // 시작 날짜 이후만 선택 가능
                                maxDate={new Date()} // 오늘까지 선택 가능
                            />
                        </div>
                        <button className="search-button" onClick={handleSearch}>
                            검색
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Totalsearchbar;
