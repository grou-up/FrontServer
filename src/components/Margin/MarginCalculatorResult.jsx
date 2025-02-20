import React, { useState, useEffect, useCallback } from "react";
import CampaignDataTable from "./MarginDataTable"; // 새로 만든 테이블 컴포넌트 가져오기
import MarginResultModal from "./MarginResultModal"; // 모달 컴포넌트 가져오기
import MarginNetTable from "./MarginNetTable";
import { getMarginByCampaignId } from "../../services/margin";

const MarginCalculatorResult = ({ campaigns, startDate, endDate }) => {
    const [expandedCampaignId, setExpandedCampaignId] = useState(new Set()); // 펼쳐진 캠페인 목록 (Set으로 변경)
    const [tableData, setTableData] = useState([]); // 캠페인 데이터 저장
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
    const [selectedCampaign, setSelectedCampaign] = useState(null); // 선택된 캠페인

    const fetchMarginResults = useCallback(async () => {
        console.log("Fetching data with:", startDate, endDate); // 확인을 위한 로그
        const allCampaignData = await Promise.all(campaigns.map(async ({ campaignId }) => {
            const response = await getMarginByCampaignId({ startDate, endDate, campaignId });
            return { campaignId, data: response?.data ?? [] };
        }));
        setTableData(allCampaignData);
    }, [startDate, endDate, campaigns]);

    useEffect(() => {
        fetchMarginResults(); // startDate와 endDate가 변경될 때마다 데이터 로드
    }, [fetchMarginResults, startDate, endDate]); // 의존성 배열에 startDate와 endDate 추가

    useEffect(() => {
        // 모든 캠페인이 펼쳐진 상태로 초기화
        const initialExpandedIds = new Set(campaigns.map(campaign => campaign.campaignId));
        setExpandedCampaignId(initialExpandedIds);
    }, [campaigns]);

    const toggleExpandCampaign = (campaignId) => {
        setExpandedCampaignId(prev => {
            const newExpanded = new Set(prev);
            newExpanded.has(campaignId) ? newExpanded.delete(campaignId) : newExpanded.add(campaignId);
            return newExpanded;
        });
    };

    const handleOptionMarginClick = (campaign) => {
        setSelectedCampaign(campaign);
        setIsModalOpen(true); // 모달 열기
    };

    return (
        <div>
            <MarginNetTable startDate={startDate} endDate={endDate} />
            <div className="campaign-list">
                {campaigns.map((campaign) => (
                    <div
                        key={campaign.campaignId}
                        className={`campaign-card ${expandedCampaignId.has(campaign.campaignId) ? "expanded" : ""}`}
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
                        {expandedCampaignId.has(campaign.campaignId) && (
                            <CampaignDataTable
                                data={tableData.find(item => item.campaignId === campaign.campaignId)?.data || []}
                                startDate={startDate}
                                endDate={endDate}
                                campaignId={campaign.campaignId}
                            />
                        )}
                    </div>
                ))}
            </div>

            {selectedCampaign && (
                <MarginResultModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    campaignId={selectedCampaign.campaignId}
                />
            )}
        </div>
    );
};

export default MarginCalculatorResult;
