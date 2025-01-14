import React, { useState } from "react";
import CampaignOptionDetailsComponent from "./CampaignOptionDetailsComponent";
import ExclusionKeywordComponent from "./ExclusionKeywordComponent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/TabComponent.css";

const TabWithContent = ({ campaignId }) => {
    const [activeTab, setActiveTab] = useState("campaign");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
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
                    <select className="dropdown">
                        <option value="yesterday">어제</option>
                        <option value="today">오늘</option>
                        <option value="last7days">최근 7일</option>
                    </select>
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

export default TabWithContent;
