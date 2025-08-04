import React, { useState, useMemo, useEffect } from 'react';
import '../../styles/DateRangeSelectCalendar.css';
import { getMarginOverview, getMarginOverviewGraph } from '../../services/margin';
import DailyTrendChart from './DailyTrendChart';
import DashboardPieChartCard from './DashboardPieChartCard'; // Import
import DashboardDetailCard from './DashboardDetailCard'; // Import
import { useDateRangePicker } from '../../hooks/useDateRangePicker';


const formatCurrency = (value) => {
    if (typeof value !== 'number') return '0';
    return value.toLocaleString();
};

const COLORS = ['#CADBFF', '#628CE8', '#F48785', '#FFD16F', '#816D79', '#5C62B8'];


const MarginOverview = () => {
    const { startDate, endDate, DatePickerButton, DatePickerModal } = useDateRangePicker();
    console.log("ss", startDate, endDate)
    const [overviewData, setOverviewData] = useState([]);
    const [graphData, setGraphData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredProduct, setHoveredProduct] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [overviewRes, graphRes] = await Promise.all([
                    getMarginOverview({ start: startDate, end: endDate }),
                    getMarginOverviewGraph({ start: startDate, end: endDate })
                ]);
                setOverviewData(overviewRes.data || []);
                setGraphData(graphRes.data || []);
            } catch (err) {
                setError("데이터를 불러오는 데 실패했습니다.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [startDate, endDate]);

    const processedData = useMemo(() => {
        if (!overviewData || overviewData.length === 0) {
            return { pieDataRevenue: [], pieDataNetProfit: [], detailData: {}, totalRevenue: 0, totalNetProfit: 0 };
        }
        const pieDataRevenue = overviewData.map(item => ({ name: item.campaignName, value: item.marSales || 0 }));
        const pieDataNetProfit = overviewData.map(item => ({ name: item.campaignName, value: item.marNetProfit || 0 }));
        const detailData = overviewData.reduce((acc, item) => {
            acc[item.campaignName] = item;
            return acc;
        }, {});
        const totalRevenue = overviewData.reduce((sum, item) => sum + (item.marSales || 0), 0);
        const totalNetProfit = overviewData.reduce((sum, item) => sum + (item.marNetProfit || 0), 0);
        return { pieDataRevenue, pieDataNetProfit, detailData, totalRevenue, totalNetProfit };
    }, [overviewData]);

    const firstCampaignName = processedData.pieDataRevenue[0]?.name;
    const detailDisplayData = hoveredProduct ? processedData.detailData[hoveredProduct] : (firstCampaignName ? processedData.detailData[firstCampaignName] : null);



    const PieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 rounded-md shadow-lg text-sm">
                    <p className="font-medium">{`${payload[0].name}: ${formatCurrency(payload[0].value)}원`}</p>
                </div>
            );
        }
        return null;
    };

    if (loading) return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

    return (
        <div className="form-main-content">
            <div className="h-full p-4 md:p-6 font-sans flex flex-col">
                <div className="w-full max-w-[1700px] mx-auto flex flex-col flex-grow">
                    {/* 헤더 */}
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <h1 className="text-2xl font-bold text-[#576FA3] mb-3 md:mb-0">마진 계산기 - 대시보드</h1>

                        {/* ✅ 매우 간결해진 날짜 선택 UI */}
                        <div className="date-selection-container">
                            <DatePickerButton />
                            <DatePickerModal />
                        </div>
                    </header>

                    {/* 상단 3개 카드 섹션: 컴포넌트로 교체 */}
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
                        <DashboardPieChartCard
                            title="매출"
                            data={processedData.pieDataRevenue}
                            totalValue={processedData.totalRevenue}
                            onHover={setHoveredProduct}
                            formatCurrency={formatCurrency}
                            COLORS={COLORS}
                            PieTooltip={PieTooltip}
                        />
                        <DashboardPieChartCard
                            title="순이익"
                            data={processedData.pieDataNetProfit}
                            totalValue={processedData.totalNetProfit}
                            onHover={setHoveredProduct}
                            formatCurrency={formatCurrency}
                            COLORS={COLORS}
                            PieTooltip={PieTooltip}
                        />
                        <DashboardDetailCard
                            data={detailDisplayData}
                            hoveredProduct={hoveredProduct}
                            formatCurrency={formatCurrency}
                        />
                    </section>

                    {/* 하단 증감 추이 그래프 */}
                    <DailyTrendChart
                        chartApiData={graphData}
                        title="일별 매출 / 순이익 추이"
                        formatCurrency={formatCurrency}
                    />
                </div>
            </div>
        </div>
    );
};

export default MarginOverview;