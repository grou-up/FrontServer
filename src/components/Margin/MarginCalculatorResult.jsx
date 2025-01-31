import React, { useState } from "react";
import CampaignDataTable from "./MarginDataTable"; // 새로 만든 테이블 컴포넌트 가져오기
import MarginResultModal from "./MarginResultModal"; // 모달 컴포넌트 가져오기

const fetchCampaignData = async (campaignId, startDate, endDate) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, name: "옵션 1", margin: 100 },
                { id: 2, name: "옵션 2", margin: 150 },
            ]);
        }, 1000);
    });
};

const MarginCalculatorResult = ({ campaigns, startDate, endDate }) => {
    const [expandedCampaignId, setExpandedCampaignId] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
    const [selectedCampaign, setSelectedCampaign] = useState(null); // 선택된 캠페인

    const toggleExpandCampaign = async (campaignId) => {
        if (expandedCampaignId === campaignId) {
            setExpandedCampaignId(null);
            setTableData([]);
        } else {
            setExpandedCampaignId(campaignId);
            const data = await fetchCampaignData(campaignId, startDate, endDate);
            setTableData(data);
        }
    };

    const handleOptionMarginClick = (campaign) => {
        setSelectedCampaign(campaign);
        setIsModalOpen(true); // 모달 열기
    };

    return (
        <div>
            <div className="campaign-list">
                {campaigns.map((campaign) => (
                    <div
                        key={campaign.campaignId}
                        className={`campaign-card ${expandedCampaignId === campaign.campaignId ? "expanded" : ""}`}
                    >
                        <div
                            className="campaign-header"
                            onClick={() => toggleExpandCampaign(campaign.campaignId)}
                        >
                            <h3>{campaign.title}</h3>
                            <button
                                className="add-button"
                                onClick={() => handleOptionMarginClick(campaign)}>
                                옵션마진 설정
                            </button>
                        </div>
                        {expandedCampaignId === campaign.campaignId && (
                            <div>
                                <CampaignDataTable
                                    data={tableData}
                                    startDate={startDate}
                                    endDate={endDate}
                                    campaignId={campaign.campaignId}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 모달 추가 */}
            {selectedCampaign && ( // selectedCampaign이 존재할 때만 모달을 렌더링
                <MarginResultModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    campaignId={selectedCampaign.campaignId} // campaignId 전달
                />
            )}
        </div>
    );
}

export default MarginCalculatorResult;
