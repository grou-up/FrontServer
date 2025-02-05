import React, { useState, useEffect } from "react";
import TabNavigation from "./TabNavigation";
import { getMyCampaigns } from "../../services/campaign";
import MarginCalculatorForm from "./MarginCalculatorForm";
import MarginCalculatorResult from "./MarginCalculatorResult";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MarginTabNavigation = () => {
    const [activeComponent, setActiveComponent] = useState("MarginCalculatorForm");
    const [campaign, setCampaign] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [monthYear, setMonthYear] = useState(new Date()); // 월 선택 상태 추가


    const handleComponentChange = (component) => {
        setActiveComponent(component);
    };

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await getMyCampaigns();
                setCampaign(response.data || []);
            } catch (error) {
                console.error("캠페인 데이터를 가져오는 중 오류 발생:", error);
            }
        };
        fetchCampaigns();
    }, []);

    // 선택된 년월의 시작일과 마지막일 계산
    const getStartAndEndDates = (date) => {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        startOfMonth.setHours(12, 0, 0, 0); // 시간 조정 (UTC 변환 시 날짜 밀림 방지)

        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999); // 정확한 마지막 순간 설정

        return { startOfMonth, endOfMonth };
    };


    // 월 선택 시 시작일과 끝일 업데이트
    const handleMonthYearChange = (date) => {
        setMonthYear(date);
        const { startOfMonth, endOfMonth } = getStartAndEndDates(date);
        setStartDate(startOfMonth);
        setEndDate(endOfMonth);
    };
    return (
        <div className="main-content">
            <div className="min-h-screen bg-gray-100">
                <div className="mt-8">
                    <main className="container mx-auto p-6">
                        <div className="flex items-center justify-between">
                            <TabNavigation onComponentChange={handleComponentChange} />
                            {/* activeComponent가 "MarginCalculatorResult"일 때만 DatePicker 표시 */}
                            {activeComponent === "MarginCalculatorResult" && (
                                <div className="date-picker-container">
                                    {/* 년월 선택기 */}
                                    <div className="date-picker-group month-picker-group">
                                        <DatePicker
                                            selected={monthYear}
                                            onChange={handleMonthYearChange}
                                            dateFormat="yyyy-MM"
                                            showMonthYearPicker
                                            className="date-picker-tab month-picker"
                                        />
                                    </div>

                                    <div className="date-picker-group">
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            dateFormat="yyyy-MM-dd"
                                            maxDate={new Date()}
                                            className="date-picker-tab"
                                        />
                                        <span className="date-separator">~</span>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setEndDate(date)}
                                            dateFormat="yyyy-MM-dd"
                                            minDate={startDate}
                                            maxDate={new Date()}
                                            className="date-picker-tab"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-8">
                            {activeComponent === "MarginCalculatorForm" && (
                                <MarginCalculatorForm campaigns={campaign} />
                            )}
                            {activeComponent === "MarginCalculatorResult" && (
                                <MarginCalculatorResult
                                    campaigns={campaign}
                                    startDate={startDate.toISOString().split("T")[0]}
                                    endDate={endDate.toISOString().split("T")[0]}
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