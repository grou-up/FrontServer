import React, { useState, useEffect, useCallback } from "react";
import CampaignDataTable from "./MarginDataTable";
import MarginResultModal from "./MarginResultModal";
import MarginNetTable from "./MarginNetTable";
import { getMarginByCampaignId } from "../../services/margin";
import { updateEfficiencyAndAdBudget } from "../../services/margin";
const MarginCalculatorResult = ({ campaigns, startDate, endDate }) => {
    const [expandedCampaignId, setExpandedCampaignId] = useState(new Set());
    const [tableData, setTableData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [modifiedData, setModifiedData] = useState({}); // 변경된 데이터 저장

    const fetchMarginResults = useCallback(async () => {
        const allCampaignData = await Promise.all(campaigns.map(async ({ campaignId }) => {
            const response = await getMarginByCampaignId({ startDate, endDate, campaignId });
            return { campaignId, data: response?.data ?? [] };
        }));
        setTableData(allCampaignData);
    }, [startDate, endDate, campaigns]);

    useEffect(() => {
        fetchMarginResults();
    }, [fetchMarginResults, startDate, endDate]);

    useEffect(() => {
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
        setIsModalOpen(true);
    };

    const handleSave = async (selectedCampaign) => {
        try {
            const changedData = modifiedData[selectedCampaign.campaignId] || {};
            if (typeof changedData !== 'object' || Array.isArray(changedData)) {
                throw new Error("변경된 데이터의 형식이 올바르지 않습니다.");
            }
            const data = {
                campaignId: selectedCampaign.campaignId,
                data: Object.values(changedData).map(item => ({
                    id: item.id, // ID
                    mardate: item.marDate, // 날짜
                    marTargetEfficiency: item.marTargetEfficiency, // 목표효율
                    marAdBudget: item.marAdBudget // 광고예산
                })),
            };
            if (data.data.length == 0) {
                alert("바뀐 데이터가 없습니다.")
                return
            }
            const response = await updateEfficiencyAndAdBudget(data);
            alert("저장되었습니다.");

            // 캠페인을 닫았다가 다시 여는 처리
            setExpandedCampaignId(prev => {
                const newSet = new Set(prev);
                newSet.delete(selectedCampaign.campaignId);
                return newSet;
            });

            // 데이터 다시 불러오기
            await fetchMarginResults();

            // 일정 시간 후 다시 열기
            setTimeout(() => {
                setExpandedCampaignId(prev => {
                    const newSet = new Set(prev);
                    newSet.add(selectedCampaign.campaignId);
                    return newSet;
                });
            }, 50); // 100ms 후 다시 열기

        } catch (error) {
            console.error("저장 중 오류 발생:", error);
            alert("저장 실패");
        }
    };


    const handleDataChange = (campaignId, newData) => {
        setModifiedData(prev => ({
            ...prev,
            [campaignId]: newData
        }));
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
                            <div className="button-container">
                                <button
                                    className="add-button"
                                    onClick={(e) => {
                                        e.stopPropagation(); // 이벤트 버블링 막기
                                        handleSave(campaign);
                                    }}>
                                    목표효율/예산 저장
                                </button>
                                <button
                                    className="add-button"
                                    onClick={(e) => {
                                        e.stopPropagation(); // 이벤트 버블링 막기
                                        handleOptionMarginClick(campaign);
                                    }}>
                                    기간별 원가 수정
                                </button>
                            </div>
                        </div>

                        {expandedCampaignId.has(campaign.campaignId) && (
                            <CampaignDataTable
                                data={tableData.find(item => item.campaignId === campaign.campaignId)?.data || []}
                                startDate={startDate}
                                endDate={endDate}
                                campaignId={campaign.campaignId}
                                onDataChange={(newData) => handleDataChange(campaign.campaignId, newData)} // 데이터 변경 처리
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
