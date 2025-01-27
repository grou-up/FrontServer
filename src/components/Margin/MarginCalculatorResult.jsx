import React, { useEffect, useState } from "react";
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
                            <button onClick={() => handleOptionMarginClick(campaign)}>
                                옵션마진 설정
                            </button>
                        </div>
                        {expandedCampaignId === campaign.campaignId && (
                            <div>
                                <CampaignDataTable
                                    data={tableData}
                                    startDate={startDate}
                                    endDate={endDate}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 모달 추가 */}
            <MarginResultModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>옵션 마진 설정 - {selectedCampaign ? selectedCampaign.title : ''}</h2>
                {/* 여기에 필요한 추가 입력 필드나 내용을 추가 */}
                <p>여기에 옵션 마진 설정 폼을 추가하세요.</p>
            </MarginResultModal>
        </div>
    );
}

export default MarginCalculatorResult;
