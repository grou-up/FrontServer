import React, { useState } from "react";
import CampaignOptionDetailsComponent from "./CampaignOptionDetailsComponent";
import KeytotalComponent from "./KeyTotalComponent";
import StatisticGrid from "./CampaignStatistics/StatisticGrid";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/TabComponent.css";
import { useParams } from "react-router-dom";
import DateRangeCalendar from "./Date/DateRangeCalendar";
import '../styles/DateRangeSelectCalendar.css'

const Totalsearchbar = ({ title }) => {
    const { campaignId } = useParams();
    const tabs = ["stats", "campaign", "keywords"];
    const [activeTab, setActiveTab] = useState("stats");

    // 오늘 기준 이번 달 1일 ~ 말일을 ISO 문자열로
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .slice(0, 10);
    const lastDay = new Date(today)
        .toISOString()
        .slice(0, 10);

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
                        <div className="date-picker-modal">
                            <DateRangeCalendar
                                initialStartDate={startDate}
                                initialEndDate={endDate}
                                onDateRangeChange={handleDateRangeChange}
                                onClose={toggleCalendar}
                            />
                        </div>
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