import React, { useState, useEffect } from "react";
import TabNavigation from "./TabNavigation";
import { getMyCampaigns } from "../../services/campaign";
import MarginCalculatorForm from "./MarginCalculatorForm";
import MarginCalculatorResult from "./MarginCalculatorResult";
import DateRangeCalendar from "../Date/DateRangeCalendar";
import '../../styles/DateRangeSelectCalendar.css';

const MarginTabNavigation = () => {
    const [activeComponent, setActiveComponent] = useState("MarginCalculatorForm");
    const [campaigns, setCampaigns] = useState([]);
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
    const [showDatePicker, setShowDatePicker] = useState(false); // 달력 표시 상태

    const handleComponentChange = (component) => {
        setActiveComponent(component);
    };

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await getMyCampaigns();
                setCampaigns(response.data || []);
            } catch (error) {
                console.error("캠페인 데이터를 가져오는 중 오류 발생:", error);
            }
        };
        fetchCampaigns();
    }, []);

    // 달력에서 날짜 범위 선택 시 호출되는 함수
    const handleDateRangeChange = (dateRange) => {
        setStartDate(dateRange.startDate);
        setEndDate(dateRange.endDate);
        console.log("선택된 날짜 범위:", dateRange);
    };

    // 날짜 선택 버튼 클릭 시 달력 토글
    const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
    };

    // 캠페인 순서 업데이트 핸들러
    const handleCampaignOrderChange = (newCampaigns) => {
        setCampaigns(newCampaigns);
    };

    return (
        <div className="main-content">
            <div className="min-h-screen bg-gray-100">
                <div className="mt-8">
                    <main className="container mx-auto p-6">
                        <div className="flex items-center justify-between">
                            <TabNavigation onComponentChange={handleComponentChange} />
                            {activeComponent === "MarginCalculatorResult" && (
                                <div className="date-selection-container">
                                    <button
                                        onClick={toggleDatePicker}
                                        className="date-selection-button"
                                    >
                                        {startDate} ~ {endDate}
                                        <span className="dropdown-arrow">▼</span>
                                    </button>

                                    {showDatePicker && (
                                        <div className="date-picker-modal">
                                            <DateRangeCalendar
                                                onDateRangeChange={handleDateRangeChange}
                                                initialStartDate={startDate}
                                                initialEndDate={endDate}
                                                onClose={toggleDatePicker}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mt-8">
                            {activeComponent === "MarginCalculatorForm" && (
                                <MarginCalculatorForm
                                    campaigns={campaigns}
                                    onCampaignOrderChange={handleCampaignOrderChange}
                                />
                            )}
                            {activeComponent === "MarginCalculatorResult" && (
                                <MarginCalculatorResult
                                    campaigns={campaigns}
                                    startDate={startDate}
                                    endDate={endDate}
                                    isActive={activeComponent === "MarginCalculatorResult"}
                                />
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MarginTabNavigation;