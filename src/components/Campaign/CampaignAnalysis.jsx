import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./CampaignAnalysis.css";
import DateRangeCalendar from "../Date/DateRangeCalendar";
import { getMyCampaignsAnalysis, getDailyMarginSummary } from "./CampaignService";

// [리팩토링] calculateRoas 함수를 컴포넌트 밖으로 분리!
// 이 함수는 props나 state를 사용하지 않으므로 밖에 있어도 돼.
// 이렇게 하면 리렌더링 시 함수가 새로 생성되는 것을 막을 수 있어.
const calculateRoas = (sales, cost) => {
    if (!cost || cost === 0) {
        return "0%";
    }
    return `${Math.round((sales / cost) * 100).toLocaleString()}%`;
};

const CampaignAnalysis = () => {
    const navigate = useNavigate(); // 훅 호출은 컴포넌트 최상위에서!
    const [activeTab, setActiveTab] = useState('total');
    const [campaignCardData, setCampaignCardData] = useState(null);
    const [productReportData, setProductReportData] = useState([]);
    const [marginReportData, setMarginReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
    const todayDate = today.toISOString().slice(0, 10);

    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(todayDate);
    const [showCalendar, setShowCalendar] = useState(false);

    const toggleCalendar = () => setShowCalendar(v => !v);

    const handleDateRangeChange = ({ startDate, endDate }) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };

    const handleNavigateToDetails = (campaignName, campaignId) => {
        if (!campaignId) {
            console.error("이동할 캠페인 ID가 없습니다.");
            return;
        }
        // 상세 페이지의 URL 경로. 이 경로는 App.js 같은 곳에 미리 설정되어 있어야 해.
        navigate(`/campaigns/${campaignId}?title=${campaignName}`);
    };

    const handleNavigateToMargin = () => {
        // 상세 페이지의 URL 경로. 이 경로는 App.js 같은 곳에 미리 설정되어 있어야 해.
        navigate(`/margin-calculator`);
    };


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // API 파라미터 키를 명세에 맞게 수정 ('start' -> 'startDate', 'end' -> 'endDate')
                // 이건 네 API 서비스 함수에 따라 다를 수 있으니 확인해 봐!
                const response = await getMyCampaignsAnalysis({ start: startDate, end: endDate });
                // 👇 이 코드를 추가해서 실제 응답을 확인해보자!
                // console.log("✅ 실제로 API에서 받은 응답:", response);
                const apiCardData = response.sumOfAdSalesAndAdCostByCampaignType;

                const formattedCardData = {
                    total: {
                        adSpend: apiCardData['총 매출']?.adCost?.toLocaleString() || '0',
                        adRevenue: apiCardData['총 매출']?.adSales?.toLocaleString() || '0',
                        roas: calculateRoas(apiCardData['총 매출']?.adSales, apiCardData['총 매출']?.adCost)
                    },
                    salesOptimization: {
                        adSpend: apiCardData['매출 최적화']?.adCost?.toLocaleString() || '0',
                        adRevenue: apiCardData['매출 최적화']?.adSales?.toLocaleString() || '0',
                        roas: calculateRoas(apiCardData['매출 최적화']?.adSales, apiCardData['매출 최적화']?.adCost)
                    },
                    manualPerformance: {
                        adSpend: apiCardData['수동 성과형']?.adCost?.toLocaleString() || '0',
                        adRevenue: apiCardData['수동 성과형']?.adSales?.toLocaleString() || '0',
                        roas: calculateRoas(apiCardData['수동 성과형']?.adSales, apiCardData['수동 성과형']?.adCost)
                    },
                    // [수정 완료] '간편 매출 스타트' 데이터가 있을 때와 없을 때 모두 처리
                    easyStart: {
                        adSpend: apiCardData['간편 매출 스타트']?.adCost?.toLocaleString() || '0',
                        adRevenue: apiCardData['간편 매출 스타트']?.adSales?.toLocaleString() || '0',
                        roas: calculateRoas(apiCardData['간편 매출 스타트']?.adSales, apiCardData['간편 매출 스타트']?.adCost)
                    }
                };

                setCampaignCardData(formattedCardData);

                //-- 👇 상품 보고서 데이터 가공(더 간단해진 버전!)-- -
                const apiProductData = response.adSalesAndAdCostByCampaignName || {};

                // Object.entries()와 map을 사용해 객체를 우리가 원하는 형태의 배열로 변환
                const formattedProductData = Object.entries(apiProductData).map(([name, data]) => {
                    return {
                        // [수정] 이제 API가 주는 정확한 타입을 사용!
                        id: data.campaignId, // 👈 중요! 캠페인 ID를 받아와서 저장
                        type: data.campAdType,
                        name: name,
                        adSpend: data.adCost.toLocaleString(),
                        adRevenue: data.adSales.toLocaleString(),
                        roas: calculateRoas(data.adSales, data.adCost),
                    };
                });
                setProductReportData(formattedProductData);

                // --- 👇 마진 보고서 데이터 가공 시작 ---
                const marginResponse = await getDailyMarginSummary({ start: startDate, end: endDate });
                const apiMarginData = marginResponse || []; // API 응답이 배열 그 자체이므로 바로 사용

                const formattedMarginData = apiMarginData.map(item => {
                    // 중요: 마진 API는 캠페인 ID를 주지 않으므로,
                    // 이미 받아놓은 상품 보고서 데이터에서 이름이 같은 캠페인의 ID를 찾아온다.
                    const productInfo = productReportData.find(p => p.name === item.marProductName);

                    return {
                        id: productInfo ? productInfo.id : null, // 찾은 ID를 할당
                        name: item.marProductName,
                        adMargin: item.marAdMargin.toLocaleString(),
                        netProfit: item.marNetProfit.toLocaleString(),
                    };
                });

                setMarginReportData(formattedMarginData);

            } catch (err) {
                setError(err);
                console.error("캠페인 분석 데이터 로딩 실패:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate]);

    const handleTabClick = (tabKey) => {
        setActiveTab(tabKey);
    };

    const renderCampaignCard = (key, label) => (
        <button
            className={`CampaignCard CampaignCard--${key} ${activeTab === key ? 'active-tab' : ''}`}
            onClick={() => handleTabClick(key)}
        >
            <span className="CampaignCard_label">{label}</span>
            <div className="CampaignCard_content">
                <div className="MetricRow">
                    <span className="MetricLabel">광고비</span>
                    <span className="MetricValue">{campaignCardData?.[key]?.adSpend}</span>
                </div>
                <div className="MetricRow">
                    <span className="MetricLabel">광고 매출</span>
                    <span className="MetricValue">{campaignCardData?.[key]?.adRevenue}</span>
                </div>
                <div className="MetricRow">
                    <span className="MetricLabel">ROAS</span>
                    <span className="MetricValue">{campaignCardData?.[key]?.roas}</span>
                </div>
            </div>
        </button>
    );

    if (loading && !campaignCardData) {
        return <div className="CampaignAnalysisPage"><h2>데이터를 불러오는 중입니다... 📈</h2></div>;
    }

    if (error) {
        return <div className="CampaignAnalysisPage"><h2>앗! 에러가 발생했어요 😱</h2><p>{error.message}</p></div>;
    }

    return (
        <div className={`CampaignAnalysisPage ${loading ? 'reloading' : ''}`}>
            <div className="PageHeader">
                <h2 className="PageTitle">광고 캠페인 분석</h2>
                <div className="date-selection-container">
                    <button className="date-selection-button" onClick={toggleCalendar}>
                        {startDate.replaceAll('-', '.')} ~ {endDate.replaceAll('-', '.')} <span className="dropdown-arrow">▼</span>
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

            <div className="CampaignCardContainer">
                {renderCampaignCard('total', '전체')}
                {renderCampaignCard('salesOptimization', '매출 최적화')}
                {renderCampaignCard('manualPerformance', '수동 성과형')}
                {renderCampaignCard('easyStart', '간편 매출 스타트')}
            </div>

            <div className="ContentGrid">
                <div className="ContentBlock">
                    <h3>상품 보고서</h3>
                    <div className="TableContainer">
                        <table>
                            <thead>
                                <tr>
                                    <th>타입</th>
                                    <th>캠페인 이름</th>
                                    <th>광고비</th>
                                    <th>광고매출</th>
                                    <th>ROAS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productReportData.map((item, index) => (
                                    <tr key={index}>
                                        <td><span className={`Tag ${item.type === '매출 최적화' ? 'TagBlue' : 'TagGreen'}`}>{item.type}</span></td>
                                        <td className="clickable-cell" onClick={() => handleNavigateToDetails(item.name, item.id)}>
                                            {item.name} <span className="ExternalLinkIcon">↗</span>
                                        </td>
                                        <td>{item.adSpend}</td>
                                        <td>{item.adRevenue}</td>
                                        <td>{item.roas}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="ContentBlock">
                    <h3>마진 보고서</h3>
                    <div className="TableContainer">
                        <table>
                            <thead>
                                <tr>
                                    <th>캠페인 이름</th>
                                    <th>광고 마진</th>
                                    <th>순이익</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marginReportData.map((item) => (
                                    // key는 고유한 id를 사용하고, 만약 id가 없다면 이름(name)을 사용
                                    <tr key={item.id || item.name}>
                                        <td className="clickable-cell" onClick={() => handleNavigateToMargin()}>
                                            {item.name} <span className="ExternalLinkIcon">↗</span>
                                        </td>
                                        <td>{item.adMargin}</td>
                                        <td>{item.netProfit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignAnalysis;