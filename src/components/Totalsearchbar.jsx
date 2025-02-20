import React, { useState } from "react";
import CampaignOptionDetailsComponent from "./CampaignOptionDetailsComponent";
import KeytotalComponent from "./KeyTotalComponent";
import DatePicker from "react-datepicker";
import StatisticGrid from "./CampaignStatistics/StatisticGrid";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/TabComponent.css";
import { useParams } from "react-router-dom";

const Totalsearchbar = ({ title }) => {
    const [activeTab, setActiveTab] = useState("stats");
    const { campaignId } = useParams();
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    firstDayOfMonth.setHours(12, 0, 0, 0);
    lastDayOfMonth.setHours(23, 59, 59, 999);
    // 초기값을 이번달로 설정
    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(lastDayOfMonth);

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };
    const tabs = ["stats", "campaign", "keywords"];

    const handleDateRangeChange = (range) => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        switch (range) {
            case "yesterday":
                setStartDate(yesterday);
                setEndDate(yesterday);
                break;
            case "last7days":
                const last7Days = new Date();
                last7Days.setDate(yesterday.getDate() - 6);
                setStartDate(last7Days);
                setEndDate(yesterday);
                break;
            case "last14days":
                const last14Days = new Date();
                last14Days.setDate(yesterday.getDate() - 13);
                setStartDate(last14Days);
                setEndDate(yesterday);
                break;
            case "last1month":
                const last1Month = new Date();
                last1Month.setMonth(yesterday.getMonth() - 1);
                setStartDate(last1Month);
                setEndDate(yesterday);
                break;
            case "thismonth":
                const today = new Date();
                const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                firstDayOfMonth.setHours(12, 0, 0, 0);
                lastDayOfMonth.setHours(23, 59, 59, 999);
                // console.log(firstDayOfMonth);
                // console.log(lastDayOfMonth);
                setStartDate(firstDayOfMonth);
                setEndDate(lastDayOfMonth);
                break;
            default:
                setStartDate(yesterday);
                setEndDate(yesterday);
                break;
        }
    };

    const handleStartDateChange = (date) => {
        if (date) {
            // console.log(date);
            setStartDate(date);
            const endDate = new Date(date);
            endDate.setMonth(endDate.getMonth() + 1); // 시작일에서 1개월 추가
            setEndDate(endDate);
        }
    };

    const handleEndDateChange = (date) => {
        if (date) {
            const monthDiff = (date - startDate) / (1000 * 60 * 60 * 24 * 30); // 날짜 차이를 월 단위로 계산
            if (monthDiff > 1) {
                alert("종료일은 시작일로부터 최대 1개월 이내로 설정해야 합니다.");
            } else {
                setEndDate(date);
            }
        }
    };

    return (
        <div className="tab-container">
            <div className="tabs-and-dates">
                <div className="tabs">
                    {tabs.map((tab, index) => {
                        let tabClass = "tab";
                        if (activeTab === tab) tabClass += " active";
                        if (index === 0 && activeTab === tab) tabClass += " left";
                        if (index === tabs.length - 1 && activeTab === tab) tabClass += " right";
                        if (index > 0 && index < tabs.length - 1 && activeTab === tab) tabClass += " middle";

                        return (
                            <button
                                key={tab}
                                className={tabClass}
                                onClick={() => handleTabChange(tab)}
                            >
                                {tab === "stats" ? "통계" : tab === "campaign" ? "옵션" : "키워드"}
                            </button>
                        );
                    })}
                </div>
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <div className="date-picker-container">
                    <select
                        className="dropdown"
                        onChange={(e) => handleDateRangeChange(e.target.value)}
                    >
                        <option value="thismonth">이번 달</option>
                        <option value="yesterday">어제</option>
                        <option value="last7days">최근 1주</option>
                        <option value="last14days">최근 2주</option>
                        <option value="last1month">최근 1달</option>
                    </select>
                    <div className="date-range">
                        <DatePicker
                            selected={startDate}
                            onChange={handleStartDateChange}
                            dateFormat="yyyy-MM-dd"
                            maxDate={new Date()}
                            className="date-picker"
                        />
                        <span className="date-separator">~</span>
                        <DatePicker
                            selected={endDate}
                            onChange={handleEndDateChange}
                            dateFormat="yyyy-MM-dd"
                            minDate={startDate}
                            maxDate={new Date()}
                            className="date-picker"
                        />
                    </div>
                </div>
            </div>

            <div
                className={`tab-content ${activeTab === "stats" ? "stats-active" :
                    activeTab === "campaign" ? "campaign-active" :
                        "keywords-active"
                    }`}
            >
                {activeTab === "stats" && (
                    <StatisticGrid
                        campaignId={campaignId}
                        startDate={startDate.toISOString().split("T")[0]}
                        endDate={endDate.toISOString().split("T")[0]}
                    />
                )}
                {activeTab === "campaign" && (
                    <CampaignOptionDetailsComponent
                        campaignId={campaignId}
                        startDate={startDate.toISOString().split("T")[0]}
                        endDate={endDate.toISOString().split("T")[0]}
                    />
                )}
                {activeTab === "keywords" && (
                    <KeytotalComponent
                        campaignId={campaignId}
                        startDate={startDate.toISOString().split("T")[0]}
                        endDate={endDate.toISOString().split("T")[0]}
                    />
                )}
            </div>
        </div>
    );
};

export default Totalsearchbar;
