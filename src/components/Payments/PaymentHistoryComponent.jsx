// PaymentHistoryComponent.js
import React, { useState } from "react";
import TabNavigation from "./TabNavigation";
import BuyHistory from "./BuyHistory.jsx";
import UseHistory from "./UseHistory.jsx";
import "../../styles/payments/PaymentHistoryComponent.css"

const PaymentHistoryComponent = () => {
    const [activeComponent, setActiveComponent] = useState("UseHistory"); // 기본 활성화 값을 UseHistory로 변경
    const [campaigns, setCampaigns] = useState([]); // 캠페인 데이터

    const handleComponentChange = (componentName) => {
        setActiveComponent(componentName);
    };

    const handleCampaignOrderChange = (newOrder) => {
        setCampaigns(newOrder); // 캠페인 순서 변경
    };

    return (
        <div className="main-content">
            <TabNavigation onComponentChange={handleComponentChange} />
            <div className="history_content">
                {activeComponent === "BuyHistory" && (
                    <BuyHistory
                        campaigns={campaigns}
                        onCampaignOrderChange={handleCampaignOrderChange} // 캠페인 순서 변경 핸들러 전달
                    />
                )}
                {activeComponent === "UseHistory" && (
                    <UseHistory
                        campaigns={campaigns}
                        isActive={activeComponent === "UseHistory"} // 활성화 여부 전달
                    />
                )}
            </div>
        </div>
    );
};
export default PaymentHistoryComponent;

