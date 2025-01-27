import React, { useState, useEffect } from "react";
import TabNavigation from "./TabNavigation";
import { getMyCampaigns } from "../../services/campaign";
import MarginCalculatorForm from "./MarginCalculatorForm";
import MarginCalculatorResult from "./MarginCalculatorResult";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MarginTabNavigation = () => {
    const [activeComponent, setActiveComponent] = useState(null);
    const [campaign, setCampaign] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

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

    return (
        <div className="main-content">
            <div className="min-h-screen bg-gray-100">
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">마진 계산식 입력</h2>
                </div>
                <main className="container mx-auto p-6">
                    <div className="flex items-center justify-between">
                        <TabNavigation onComponentChange={handleComponentChange} />
                        {/* activeComponent가 "MarginCalculatorResult"일 때만 DatePicker 표시 */}
                        {activeComponent === "MarginCalculatorResult" && (
                            <div className="date-picker-container">
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
    );
};

export default MarginTabNavigation;