import React, { useEffect, useState, useContext, useCallback } from "react"; // useCallback 추가
import StatTable from "./StatTable";
import StatGraph from "./StatGraph";
import StatGraphTable from "./StatGraphTable";
import StatGraph2 from "./StatGraph2";
import StatGraph3 from "./StatGraph3";
import MemoDisplay from './MemoDisplay'; // 1. 방금 만든 메모 컴포넌트 import
import ProfitDonutChart from './ProfitDonutChart'; // 1. 방금 만든 도넛 차트 컴포넌트 import
import { getCampaignStats } from "../../services/keyword";
import { getMarginByCampaignId } from "../../services/margin.js";
import "../../styles/campaignStats/StatisticGrid.css";
import "../../styles/SwitchableGraphComponent.css"; // 인디케이터 CSS 파일 임포트
import { MyContext } from "../MyContext.jsx";

// 1. 중복되는 합산 로직을 별도의 함수로 분리 (리팩토링)
const aggregateStats = (statsObject) => {
    if (!statsObject) return {};
    return Object.values(statsObject).reduce((acc, stats) => {
        acc.adCost = (acc.adCost || 0) + (stats.adCost || 0);
        acc.adSales = (acc.adSales || 0) + (stats.adSales || 0);
        acc.clicks = (acc.clicks || 0) + (stats.clicks || 0);
        acc.impressions = (acc.impressions || 0) + (stats.impressions || 0);
        acc.totalSales = (acc.totalSales || 0) + (stats.totalSales || 0);
        return acc;
    }, {});
};

// 2. 인디케이터로 보여줄 그래프 컴포넌트들을 미리 매핑
const graphComponents = {
    roas: StatGraph,
    cost: StatGraph2,
    sales: StatGraph3,
};

// 그래프의 이름(key)과 화면에 표시될 이름(label)도 관리하면 좋아
const graphViews = [
    { key: 'roas', label: 'ROAS% / 광고비' },
    { key: 'cost', label: '비용' },
    { key: 'sales', label: '매출' },
];

const StatisticGrid = ({ campaignId, startDate, endDate }) => {
    const { memoData, getMemoAboutCampaign } = useContext(MyContext);
    const [nonSearchStats, setNonSearchStats] = useState({});
    const [searchStats, setSearchStats] = useState({});
    const [marginData, setMarginData] = useState({});
    const [campaignStats, setCampaignStats] = useState(null);
    const [aggregatedSearchStats, setAggregatedSearchStats] = useState({});
    const [aggregatedNonSearchStats, setAggregatedNonSearchStats] = useState({});

    // 3. 어떤 그래프를 보여줄지 결정할 상태 추가
    const [activeGraph, setActiveGraph] = useState(graphViews[0].key); // 기본값으로 첫 번째 그래프 설정

    const fetchCampaignStat = useCallback(async () => {
        try {
            const response = await getCampaignStats({ campaignId, start: startDate, end: endDate });
            const marginResponse = await getMarginByCampaignId({ startDate, endDate, campaignId });
            setMarginData(marginResponse.data);
            setCampaignStats(response.data);
        } catch (error) {
            console.error("Error fetching campaign stats:", error);
        }
    }, [campaignId, startDate, endDate]);

    const fetchMemoData = useCallback(() => {
        getMemoAboutCampaign({ campaignId, start: startDate, end: endDate });
    }, [campaignId, startDate, endDate, getMemoAboutCampaign]);

    useEffect(() => {
        fetchCampaignStat();
        fetchMemoData();
    }, [fetchCampaignStat, fetchMemoData]);

    useEffect(() => {
        if (campaignStats) {
            setSearchStats(campaignStats.search || {});
            setNonSearchStats(campaignStats.nonSearch || {});

            // 분리된 합산 함수를 사용
            setAggregatedSearchStats(aggregateStats(campaignStats.search));
            setAggregatedNonSearchStats(aggregateStats(campaignStats.nonSearch));
        }
    }, [campaignStats]);

    // 4. 현재 활성화된 그래프 컴포넌트를 가져온다.
    const ActiveGraphComponent = graphComponents[activeGraph];

    return (
        <div className="grid-container">
            <div className="grid-left-column">
                <div className="grid-item">
                    {/* 2. '매출 대비 이익' 텍스트 대신 차트 컴포넌트를 렌더링 */}
                    {/* marginData가 로드되었을 때만 차트를 보여주도록 조건부 렌더링 */}
                    <div>
                        {marginData.length > 0 ? (
                            <ProfitDonutChart marginData={marginData} />
                        ) : (
                            <div>데이터를 불러오는 중...</div>
                        )}
                    </div>
                </div>
                <div className="grid-memo">
                    <div style={{ height: '663px' }}>
                        {memoData ? (
                            <MemoDisplay memoData={memoData} />
                        ) : (
                            <div>메모 로딩 중...</div>
                        )}
                    </div>
                </div>
            </div>
            <div className="grid-right-column">
                <div className="grid-item">
                    <StatTable
                        search={aggregatedSearchStats}
                        nonSearch={aggregatedNonSearchStats}
                    />
                </div>

                {/* 5. 여기에 인디케이터와 그래프 렌더링 로직 추가 */}
                <div className="switchable-graph-container">
                    <div className="view-switcher">
                        {graphViews.map((view) => (
                            <button
                                key={view.key}
                                className={`dot-button ${activeGraph === view.key ? 'active' : ''}`}
                                onClick={() => setActiveGraph(view.key)}
                                aria-label={view.label}
                            />
                        ))}
                    </div>
                    <div className="graph-content-area">
                        {/* ActiveGraphComponent가 null이 아닐 때만 렌더링 */}
                        <div style={{ height: '300px' }}>
                            {ActiveGraphComponent && (
                                <ActiveGraphComponent
                                    search={searchStats}
                                    nonSearch={nonSearchStats}
                                    memoData={memoData} // StatGraph에만 필요하다면 아래처럼 조건부로 전달 가능
                                    startDate={startDate}
                                    endDate={endDate}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid-item">
                    <div style={{ height: '250px' }}>
                        <StatGraphTable
                            margin={marginData}
                            search={searchStats}
                            nonSearch={nonSearchStats}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticGrid;