import React, { useState } from "react";
import CampaignOptionDetailsComponent from "./CampaignOptionDetailsComponent";
import KeytotalComponent from "./KeyTotalComponent";
import StatisticGrid from "./CampaignStatistics/StatisticGrid";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/TabComponent.css";
import { useParams } from "react-router-dom";
import DateRangeCalendar from "./Date/DateRangeCalendar";
import '../styles/DateRangeSelectCalendar.css' // 이 CSS 파일에 z-index 설정이 중요합니다.

const Totalsearchbar = ({ title }) => {
    const { campaignId } = useParams();
    const tabs = ["stats", "campaign", "keywords"];
    const [activeTab, setActiveTab] = useState("stats");

    // 오늘 기준 이번 달 1일 ~ 말일을 ISO 문자열로
    // 컴포넌트 상단
    const today = new Date();

    // 1일 오전 12시가 아니라, 예시대로 12시에 맞추고 싶다면
    const firstDayDate = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDayDate.setHours(12, 0, 0, 0);

    // 마지막 일자를 “오늘”로 (23:59:59.999까지)
    const lastDayDate = new Date(today);
    lastDayDate.setHours(23, 59, 59, 999);

    // ISO 문자열(YYYY-MM-DD)로 변환
    // 현재 날짜가 2025-07-03이므로, initialStartDate를 '2025-07-01'로,
    // initialEndDate를 '2025-07-02' (어제)로 초기화하는 것이 이전 요청에 더 부합합니다.
    // 만약 항상 이번달 1일 ~ 오늘로 하고 싶다면 이 부분은 그대로 두세요.
    // 여기서는 예시로 "오늘"까지 선택 가능하도록 두겠습니다.
    const firstDay = firstDayDate.toISOString().slice(0, 10);
    const lastDay = lastDayDate.toISOString().slice(0, 10);

    // state 초기화 (문자열)
    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate] = useState(lastDay);

    // 달력 모달 토글
    const [showCalendar, setShowCalendar] = useState(false);
    const toggleCalendar = () => setShowCalendar((v) => !v);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // DateRangeCalendar에서 선택된 값을 string 날짜 범위로 받아옴
    const handleDateRangeChange = ({ startDate, endDate }) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };

    return (
        <div className="tab-container">
            <div className="tabs-and-dates">
                <div className="tabs">
                    {tabs.map((tab, i) => {
                        let cls = "tab";
                        if (activeTab === tab) {
                            cls += " active";
                            if (i === 0) cls += " left";
                            else if (i === tabs.length - 1) cls += " right";
                            else cls += " middle";
                        }
                        const label =
                            tab === "stats"
                                ? "통계"
                                : tab === "campaign"
                                    ? "옵션"
                                    : "키워드";
                        return (
                            <button
                                key={tab}
                                className={cls}
                                onClick={() => handleTabChange(tab)}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                <h2 className="text-xl font-bold mb-4">{title}</h2>

                <div className="date-selection-container">
                    <button
                        className="date-selection-button"
                        onClick={toggleCalendar}
                    >
                        {startDate} ~ {endDate}{" "}
                        <span className="dropdown-arrow">▼</span>
                    </button>

                    {showCalendar && (
                        <>
                            {/* !!!!!!!! 이 부분이 추가되어야 합니다. !!!!!!!! */}
                            {/* 오버레이를 추가하여 모달 뒷 배경 클릭 시 닫히도록 하고 z-index를 관리합니다. */}
                            <div className="date-picker-overlay" onClick={toggleCalendar}></div>
                            <div className="date-picker-modal">
                                <DateRangeCalendar
                                    initialStartDate={startDate}
                                    initialEndDate={endDate}
                                    onDateRangeChange={handleDateRangeChange}
                                    onClose={toggleCalendar}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div
                className={`tab-content ${activeTab === "stats"
                    ? "stats-active"
                    : activeTab === "campaign"
                        ? "campaign-active"
                        : "keywords-active"
                    }`}
            >
                {activeTab === "stats" && (
                    <StatisticGrid
                        campaignId={campaignId}
                        startDate={startDate}
                        endDate={endDate}
                    />
                )}
                {activeTab === "campaign" && (
                    <CampaignOptionDetailsComponent
                        campaignId={campaignId}
                        startDate={startDate}
                        endDate={endDate}
                    />
                )}
                {activeTab === "keywords" && (
                    <KeytotalComponent
                        campaignId={campaignId}
                        startDate={startDate}
                        endDate={endDate}
                    />
                )}
            </div>
        </div>
    );
};

export default Totalsearchbar;