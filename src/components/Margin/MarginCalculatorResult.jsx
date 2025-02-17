import React, { useState, useEffect, useCallback } from "react";
import CampaignDataTable from "./MarginDataTable"; // 새로 만든 테이블 컴포넌트 가져오기
import MarginResultModal from "./MarginResultModal"; // 모달 컴포넌트 가져오기
import MarginNetTable from "./MarginNetTable";
import { getMarginByCampaignId } from "../../services/margin";

const MarginCalculatorResult = ({ campaigns, startDate, endDate, isActive }) => {
    const [expandedCampaignId, setExpandedCampaignId] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
    const [selectedCampaign, setSelectedCampaign] = useState(null); // 선택된 캠페인

    const fetchMarginResults = useCallback(async (campaigns) => {
        const allCampaignData = [];
        // 캠페인 ID를 기반으로 API 호출
        for (const campaign of campaigns) {
            const campaignId = campaign.campaignId;
            const response = await getMarginByCampaignId({ startDate, endDate, campaignId });
            if (response && response.data) {
                allCampaignData.push({ campaignId, data: response.data });
            }
        }
        // tableData에 데이터를 설정
        setTableData(allCampaignData);
    }, [startDate, endDate]);

    // 페이지에 처음 방문했는지를 localStorage로 확인
    useEffect(() => {
        const isFirstVisit = localStorage.getItem("isFirstVisit");
        if (isActive && isFirstVisit === "true") {
            fetchMarginResults(campaigns);
            localStorage.setItem("isFirstVisit", "false"); // 이후에는 API 호출하지 않도록 설정
        }
    }, [isActive, campaigns, fetchMarginResults]);

    const toggleExpandCampaign = async (campaignId) => {
        if (expandedCampaignId === campaignId) {
            setExpandedCampaignId(null);
        } else {
            setExpandedCampaignId(campaignId);
        }
    };

    const handleOptionMarginClick = (campaign) => {
        setSelectedCampaign(campaign);
        setIsModalOpen(true); // 모달 열기
    };

    return (
        <div>
            <div>
                <MarginNetTable startDate={startDate} endDate={endDate} />
            </div>
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
                                    data={tableData.find(item => item.campaignId === campaign.campaignId)?.data || []}
                                    startDate={startDate} // YYYY-MM-DD 형식으로 그대로 전달
                                    endDate={endDate} // YYYY-MM-DD 형식으로 그대로 전달
                                    campaignId={campaign.campaignId}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedCampaign && (
                <MarginResultModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    campaignId={selectedCampaign.campaignId} // campaignId 전달
                />
            )}
        </div>
    );
};

export default MarginCalculatorResult;
