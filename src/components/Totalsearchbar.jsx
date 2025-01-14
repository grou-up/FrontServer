import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import CampaignOptionDetailsComponent from "./CampaignOptionDetailsComponent";
import ExclusionKeywordComponent from "./ExclusionKeywordComponent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/TabComponent.css";

const Totalsearchbar = () => {
    const [activeTab, setActiveTab] = useState("campaign");
    const [startDate, setStartDate] = useState(new Date());
    const { campaignId } = useParams(); // URL 파라미터에서 campaignId를 가져옴
    const [endDate, setEndDate] = useState(new Date());

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };

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
                    <button
                        className={`tab ${activeTab === "stats" ? "active" : ""}`}
                        onClick={() => handleTabChange("stats")}
                    >
                        통계
                    </button>
                    <button
                        className={`tab ${activeTab === "campaign" ? "active" : ""}`}
                        onClick={() => handleTabChange("campaign")}
                    >
                        옵션
                    </button>
                    <button
                        className={`tab ${activeTab === "keywords" ? "active" : ""}`}
                        onClick={() => handleTabChange("keywords")}
                    >
                        키워드
                    </button>
                </div>

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
            <div className="tab-content">
                {activeTab === "stats" && <div>통계 콘텐츠</div>}
                {activeTab === "campaign" && (
                    <CampaignOptionDetailsComponent
                        campaignId={campaignId}
                        startDate={startDate.toISOString().split("T")[0]}
                        endDate={endDate.toISOString().split("T")[0]}
                    />
                )}
                {activeTab === "keywords" && (
                    <ExclusionKeywordComponent campaignId={campaignId} />
                )}
            </div>
        </div>
    );
};

export default Totalsearchbar;
