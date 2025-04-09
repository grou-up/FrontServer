import React, { useEffect, useState, useContext } from "react";
import StatTable from "./StatTable";
import StatGraph from "./StatGraph";
import StatGraphTable from "./StatGraphTable";
import StatGraph2 from "./StatGraph2";
import StatGraph3 from "./StatGraph3";
import { getCampaignStats } from "../../services/keyword";
import "../../styles/campaignStats/StatisticGrid.css";
import { MyContext } from "../MyContext.jsx";

const StatisticGrid = ({ campaignId, startDate, endDate }) => {
    const { memoData, getMemoAboutCampaign } = useContext(MyContext);
    const [nonSearchStats, setNonSearchStats] = useState({});
    const [searchStats, setSearchStats] = useState({});
    const [campaignStats, setCampaignStats] = useState(null);
    const [aggregatedSearchStats, setAggregatedSearchStats] = useState({}); // 합산된 데이터를 위한 상태
    const [aggregatedNonSearchStats, setAggregatedNonSearchStats] = useState({}); // 합산된 데이터를 위한 상태

    const fetchCampaignStat = async () => {
        try {
            const response = await getCampaignStats({ campaignId, start: startDate, end: endDate });
            // console.log(response.data);
            setCampaignStats(response.data);// 응답 데이터를 상태로 저장
        } catch (error) {
            console.error("Error fetching campaign stats:", error);
        }
    };

    useEffect(() => {
        fetchCampaignStat();// 컴포넌트가 마운트될 때 데이터 가져오기
        getMemoAboutCampaign({ campaignId, start: startDate, end: endDate }); // fetchMemoData 대체
    }, [campaignId, startDate, endDate, getMemoAboutCampaign]); // getMemoAboutCampaign 의존성 추가

    useEffect(() => {
        if (campaignStats && campaignStats.search) {
            const newAggregatedStats = {};

            // campaignStats.search 순회
            Object.entries(campaignStats.search).forEach(([date, stats]) => {
                newAggregatedStats.keyAdcost = (newAggregatedStats.keyAdcost || 0) + (stats.keyAdcost || 0);
                newAggregatedStats.keyAdsales = (newAggregatedStats.keyAdsales || 0) + (stats.keyAdsales || 0);
                newAggregatedStats.keyClicks = (newAggregatedStats.keyClicks || 0) + (stats.keyClicks || 0);
                newAggregatedStats.keyImpressions = (newAggregatedStats.keyImpressions || 0) + (stats.keyImpressions || 0);
                newAggregatedStats.keyTotalSales = (newAggregatedStats.keyTotalSales || 0) + (stats.keyTotalSales || 0);
            });
            // console.log(newAggregatedStats);
            setSearchStats(campaignStats.search);
            setAggregatedSearchStats(newAggregatedStats); // 합산된 데이터 상태로 저장
        }
        if (campaignStats && campaignStats.nonSearch) {
            const newAggregatedStats = {};

            // campaignStats.search 순회
            Object.entries(campaignStats.nonSearch).forEach(([date, stats]) => {
                newAggregatedStats.keyAdcost = (newAggregatedStats.keyAdcost || 0) + (stats.keyAdcost || 0);
                newAggregatedStats.keyAdsales = (newAggregatedStats.keyAdsales || 0) + (stats.keyAdsales || 0);
                newAggregatedStats.keyClicks = (newAggregatedStats.keyClicks || 0) + (stats.keyClicks || 0);
                newAggregatedStats.keyImpressions = (newAggregatedStats.keyImpressions || 0) + (stats.keyImpressions || 0);
                newAggregatedStats.keyTotalSales = (newAggregatedStats.keyTotalSales || 0) + (stats.keyTotalSales || 0);
            });
            // console.log(newAggregatedStats);
            setNonSearchStats(campaignStats.nonSearch);
            setAggregatedNonSearchStats(newAggregatedStats); // 합산된 데이터 상태로 저장
        }

    }, [campaignStats]); // campaignStats가 업데이트될 때마다 실행

    return (
        <div className="grid-container">
            <div className="grid-item">
                <StatTable
                    search={aggregatedSearchStats}
                    nonSearch={aggregatedNonSearchStats}
                />
            </div>
            <div className="grid-item-graph"> {/*css 에서 height를 수정하여 세로 크기 조정 가능*/}
                <StatGraph
                    search={searchStats}
                    nonSearch={nonSearchStats}
                    memoData={memoData}
                    startDate={startDate}
                    endDate={endDate}
                />
            </div>
            <div className="grid-item">
                <StatGraphTable
                    search={searchStats}
                    nonSearch={nonSearchStats}
                    startDate={startDate}
                    endDate={endDate}
                />
            </div>
            <div className="grid-item-graph"> {/*css 에서 height를 수정하여 세로 크기 조정 가능*/}
                <StatGraph2
                    search={searchStats}
                    nonSearch={nonSearchStats}
                    startDate={startDate}
                    endDate={endDate}
                />
            </div>
            <div className="grid-item-graph"> {/*css 에서 height를 수정하여 세로 크기 조정 가능*/}
                <StatGraph3
                    search={searchStats}
                    nonSearch={nonSearchStats}
                    startDate={startDate}
                    endDate={endDate}
                />
            </div>
        </div>
    );

};

export default StatisticGrid;
