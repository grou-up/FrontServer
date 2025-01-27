import React, { useState } from "react";
import CampaignOptionDetailsComponent from "./CampaignOptionDetailsComponent";
import KeytotalComponent from "./KeyTotalComponent";
import DatePicker from "react-datepicker";
import StatisticGrid from "./CampaignStatistics/StatisticGrid"
import "react-datepicker/dist/react-datepicker.css";
import "../styles/TabComponent.css";
import { useParams } from "react-router-dom";

const Totalsearchbar = ({ title }) => {
    const [activeTab, setActiveTab] = useState("campaign");
    const [startDate, setStartDate] = useState(new Date());
    const { campaignId } = useParams(); // URL 파라미터에서 campaignId를 가져옴
    const [endDate, setEndDate] = useState(new Date());

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };
    const tabs = ["stats", "campaign", "keywords"];

    const handleDateRangeChange = (range) => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1); // 어제 날짜 계산

        switch (range) {
            case "yesterday":
                setStartDate(yesterday);
                setEndDate(yesterday);
                break;
            case "last7days":
                const last7Days = new Date();
                last7Days.setDate(yesterday.getDate() - 6); // 어제 포함 최근 7일
                setStartDate(last7Days);
                setEndDate(yesterday);
                break;
            case "last14days":
                const last14Days = new Date();
                last14Days.setDate(yesterday.getDate() - 13); // 어제 포함 최근 14일
                setStartDate(last14Days);
                setEndDate(yesterday);
                break;
            case "last1month":
                const last1Month = new Date();
                last1Month.setMonth(yesterday.getMonth() - 1); // 어제 포함 최근 1달
                setStartDate(last1Month);
                setEndDate(yesterday);
                break;
            default:
                setStartDate(yesterday);
                setEndDate(yesterday);
                break;
        }
    };


    return (
        <div className="tab-container">
            {/* 상단 영역 */}
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
                {/* 날짜 선택기 */}
                <div className="date-picker-container">
                    <select
                        className="dropdown"
                        onChange={(e) => handleDateRangeChange(e.target.value)}
                    >
                        <option value="yesterday">어제</option>
                        <option value="last7days">최근 1주</option>
                        <option value="last14days">최근 2주</option>
                        <option value="last1month">최근 1달</option>
                    </select>
                    <div className="date-range">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="yyyy-MM-dd"
                            maxDate={new Date()}
                            className="date-picker"
                        />
                        <span className="date-separator">~</span>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="yyyy-MM-dd"
                            minDate={startDate}
                            maxDate={new Date()}
                            className="date-picker"
                        />
                    </div>
                </div>
            </div>

            {/* 콘텐츠 */}
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
