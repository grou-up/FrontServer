import React, { useState, useEffect, useCallback, useRef } from "react";
// import CampaignDataTable from "./MarginDataTable";
import MarginDataTable from "./MarginDataTable";
import MarginResultModal from "./MarginResultModal";
import MarginNetTable from "../Margin_v2/MarginNetTable";
import { getMarginByCampaignId } from "../../services/margin";
import { updateEfficiencyAndAdBudget } from "../../services/margin";
import DateRangeCalendar from "../Date/DateRangeCalendar";
import '../../styles/margin/MarginCalculatorResult.css'

const MarginCalculatorResult = ({ campaigns }) => {

    const [expandedCampaignId, setExpandedCampaignId] = useState(new Set());
    const [tableData, setTableData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modifiedData, setModifiedData] = useState({});
    const [isDataLoaded, setIsDataLoaded] = useState(false); // ✅ 데이터 로딩 상태 추가

    // MarginNetTable 최신화를 위한 ref 추가
    const marginNetTableRef = useRef(null);

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
    const todayDate = today.toISOString().slice(0, 10);

    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(todayDate);
    const [showCalendar, setShowCalendar] = useState(false);

    const toggleCalendar = () => setShowCalendar(v => !v);

    // MarginNetTable 강제 새로고침 함수 - useEffect보다 먼저 선언
    const refreshMarginNetTable = useCallback(() => {
        if (marginNetTableRef.current && typeof marginNetTableRef.current.refreshData === 'function') {
            marginNetTableRef.current.refreshData();
        }
    }, []);

    const handleDateRangeChange = ({ startDate, endDate }) => {
        setStartDate(startDate);
        setEndDate(endDate);
        // ✅ 날짜 변경 시에도 MarginNetTable 새로고침
        setTimeout(() => {
            refreshMarginNetTable();
        }, 100);
    };

    const fetchMarginResults = useCallback(async () => {
        // ✅ 훅에서 제공하는 startDate, endDate를 사용
        if (!campaigns || campaigns.length === 0 || !startDate || !endDate) return;

        setIsDataLoaded(false); // ✅ 로딩 시작

        try {
            const allCampaignData = await Promise.all(campaigns.map(async ({ campaignId }) => {
                const response = await getMarginByCampaignId({ startDate, endDate, campaignId });
                return { campaignId, data: response?.data ?? [] };
            }));
            setTableData(allCampaignData);

            // ✅ 모든 데이터 로딩 완료 후 약간의 지연시간을 두고 MarginNetTable 표시
            setTimeout(() => {
                setIsDataLoaded(true);
            }, 300);

        } catch (error) {
            console.error("마진 결과 데이터 로딩 중 에러 발생:", error);
            // 에러 발생 시 tableData를 비워주는 것이 좋습니다.
            setTableData([]);
            setIsDataLoaded(true); // ✅ 에러 시에도 MarginNetTable은 표시
        }
    }, [startDate, endDate, campaigns]);

    useEffect(() => {
        fetchMarginResults();
        // ✅ 화면 로드 시 MarginNetTable도 새로고침
        refreshMarginNetTable();
    }, [fetchMarginResults, refreshMarginNetTable]);

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

    const handleOptionMarginClick = () => {
        setIsModalOpen(true);
    };

    const handleSave = async (campaignId) => {

        try {
            // ✅ selectedCampaign.campaignId 대신, 인자로 받은 campaignId를 바로 사용합니다.
            const changedData = modifiedData[campaignId] || {};

            // ... (이하 로직은 거의 동일)
            if (typeof changedData !== 'object' || Array.isArray(changedData)) {
                throw new Error("변경된 데이터의 형식이 올바르지 않습니다.");
            }
            const data = {
                campaignId: campaignId, // ✅ campaignId를 그대로 사용
                data: Object.values(changedData).map(item => {
                    return {
                        id: item?.id,
                        mardate: item.marDate,
                        marTargetEfficiency: item.marTargetEfficiency,
                        marAdBudget: item.marAdBudget
                    };
                }),
            };
            if (data.data.length === 0) {
                alert("바뀐 데이터가 없습니다.");
                return;
            }

            await updateEfficiencyAndAdBudget(data);
            alert("저장되었습니다.");

            // 캠페인을 닫았다가 다시 여는 처리
            setExpandedCampaignId(prev => {
                const newSet = new Set(prev);
                newSet.delete(campaignId);
                return newSet;
            });

            // 데이터 다시 불러오기
            await fetchMarginResults();

            // ✅ MarginNetTable도 새로고침 - fetchMarginResults 완료 후 실행
            setTimeout(() => {
                refreshMarginNetTable();
            }, 400);

            // 일정 시간 후 다시 열기
            setTimeout(() => {
                setExpandedCampaignId(prev => {
                    const newSet = new Set(prev);
                    newSet.add(campaignId);
                    return newSet;
                });
            }, 50); // 100ms 후 다시 열기

        } catch (error) {
            console.error("저장 중 오류 발생:", error);
            alert("저장 실패");
        }
    };

    useEffect(() => {
    }, [modifiedData]); // 의존성 배열에 modifiedData를 넣습니다.

    const handleDataChange = useCallback((campaignId, newData) => {
        setModifiedData(prev => ({
            ...prev,
            [campaignId]: newData
        }));
    }, []); // 의존성 배열이 비어있으면 이 함수는 단 한번만 생성됩니다.

    return (
        <div className="form-main-content">
            {/* 날짜 선택 UI 추가 */}
            <div className="flex items-center justify-end mb-4">
                <button
                    className="add-button" // 스타일은 필요에 맞게 조정하세요.
                    onClick={handleOptionMarginClick} // ✅ campaign 객체 전달을 제거합니다.
                >
                    기간별 원가 수정
                </button>
                <div className="date-selection-container">
                    <button className="date-selection-button" onClick={toggleCalendar}>
                        {startDate.replaceAll('-', '.')} ~ {endDate.replaceAll('-', '.')}
                    </button>
                    {showCalendar && (
                        <>
                            <div className="date-picker-overlay" onClick={toggleCalendar}></div>
                            <div className="date-picker-modal">
                                <DateRangeCalendar
                                    initialStartDate={startDate}
                                    initialEndDate={endDate}
                                    onDateRangeChange={handleDateRangeChange}
                                    onClose={toggleCalendar}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ✅ MarginNetTable을 다시 위로 이동하고 로딩 상태 관리 */}
            {isDataLoaded ? (
                <MarginNetTable
                    ref={marginNetTableRef}
                    startDate={startDate}
                    endDate={endDate}
                />
            ) : (
                <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#666',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    margin: '20px 0'
                }}>
                    <div>데이터를 불러오는 중...</div>
                </div>
            )}

            <div className="campaign-list">
                {(campaigns || []).map((campaign) => (
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
                                {/* <button
                                    className="add-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSave(campaign);
                                    }}>
                                    목표효율/예산 저장
                                </button> */}

                            </div>
                        </div>

                        {expandedCampaignId.has(campaign.campaignId) && (
                            <MarginDataTable
                                data={tableData.find(item => item.campaignId === campaign.campaignId)?.data || []}
                                startDate={startDate}
                                endDate={endDate}
                                campaignId={campaign.campaignId}
                                onDataChange={handleDataChange}
                                onSave={handleSave} // ✅ onSave라는 이름으로 함수를 내려줍니다.
                            />
                        )}
                    </div>
                ))}
            </div>

            <MarginResultModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default MarginCalculatorResult;