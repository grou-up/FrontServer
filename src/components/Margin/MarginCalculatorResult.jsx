import React, { useState, useEffect, useCallback } from "react";
import CampaignDataTable from "./MarginDataTable";
import MarginResultModal from "./MarginResultModal";
import MarginNetTable from "./MarginNetTable";
import { getMarginByCampaignId } from "../../services/margin";

const MarginCalculatorResult = ({ campaigns, startDate, endDate, isActive }) => {
    const [expandedCampaigns, setExpandedCampaigns] = useState(new Set()); // 펼쳐진 캠페인 목록 (Set으로 변경)
    const [allCampaignData, setAllCampaignData] = useState([]); // 모든 캠페인 데이터 저장
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isNetTableVisible, setIsNetTableVisible] = useState(false);

    const fetchMarginResults = useCallback(async () => {
        setIsLoading(true);
        try {
            const promises = campaigns.map(async ({ campaignId }) => {
                const response = await getMarginByCampaignId({ startDate, endDate, campaignId });
                console.log(response)
                return { campaignId, data: response?.data ?? [] };
            });

            const results = await Promise.all(promises);
            setAllCampaignData(results);
        } catch (error) {
            console.error("데이터를 가져오는 중 오류 발생:", error);
        } finally {
            setIsLoading(false);
            setIsNetTableVisible(true); // 모든 데이터 로드 완료 후 표시
        }
    }, [campaigns]);

    useEffect(() => {
        fetchMarginResults();
    }, [isActive, expandedCampaigns, campaigns.length, fetchMarginResults]);

    useEffect(() => {
        setIsNetTableVisible(false); // 날짜가 변경될 때마다 NetTable을 숨긴다.
        setAllCampaignData([]); // 데이터를 초기화
        fetchMarginResults();
    }, [startDate, endDate]);


    const toggleExpandCampaign = (campaignId) => {
        setExpandedCampaigns(prev => {
            const newExpanded = new Set(prev);
            newExpanded.has(campaignId) ? newExpanded.delete(campaignId) : newExpanded.add(campaignId);
            return newExpanded;
        });
    };

    return (
        <div>
            {/* Net Table 표시 */}
            {isLoading ? <div>로딩 중...</div> : isNetTableVisible && <MarginNetTable startDate={startDate} endDate={endDate} />}

            {/* 캠페인 목록 */}
            <div className="campaign-list">
                {campaigns.map((campaign) => (
                    <div key={campaign.campaignId} className="campaign-card expanded">
                        <div className="campaign-header" onClick={() => toggleExpandCampaign(campaign.campaignId)}>
                            <h3>{campaign.title}</h3>
                            <button className="add-button" onClick={() => {
                                setSelectedCampaign(campaign);
                                setIsModalOpen(true);
                            }}>
                                옵션마진 설정
                            </button>
                        </div>
                        <CampaignDataTable
                            data={allCampaignData.find(item => item.campaignId === campaign.campaignId)?.data || []}
                            startDate={startDate}
                            endDate={endDate}
                        />
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
