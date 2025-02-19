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
    const [startDate, setStartDate] = useState(new Date()); // 초기 시작일
    const [endDate, setEndDate] = useState(new Date()); // 초기 끝일
    const [monthYear, setMonthYear] = useState(new Date()); // 월 선택 상태 추가

    const handleComponentChange = (component) => {
        setActiveComponent(component);
        // 현재 월의 시작일과 끝일 계산
        const { startOfMonth, endOfMonth } = getStartAndEndDates(monthYear);
        setStartDate(startOfMonth);
        setEndDate(endOfMonth);
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

    const handleStartDateChange = (date) => {
        if (date) {
            setStartDate(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 30); // 시작일에서 30일 추가
            setEndDate(endDate);
        }
    };

    const handleEndDateChange = (date) => {
        if (date) {
            const diffDays = (date - startDate) / (1000 * 60 * 60 * 24); // 날짜 차이를 일 단위로 계산
            if (diffDays > 30) {
                alert("종료일은 시작일로부터 최대 30일 이내로 설정해야 합니다.");
            } else {
                setEndDate(date);
            }
        }
    };

    return (
        <div className="main-content">
            <div className="min-h-screen bg-gray-100">
                <div className="mt-8">
                    <main className="container mx-auto p-6">
                        <div className="flex items-center justify-between">
                            <TabNavigation onComponentChange={handleComponentChange} />
                            {activeComponent === "MarginCalculatorResult" && (
                                <div className="date-picker-container">
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
                                            onChange={handleStartDateChange}
                                            dateFormat="yyyy-MM-dd"
                                            maxDate={new Date()}
                                            className="date-picker-tab"
                                        />
                                        <span className="date-separator">~</span>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={handleEndDateChange}
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
                                    startDate={startDate.toISOString().split("T")[0]} // 시작일
                                    endDate={endDate.toISOString().split("T")[0]} // 끝일
                                    isActive={activeComponent === "MarginCalculatorResult"} // 활성화 여부 전달
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
