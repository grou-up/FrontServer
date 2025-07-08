import React, { useState } from "react";
import "./CampaignAnalysis.css";

// 각 탭(카드)에 대한 데이터
const campaignData = {
    total: { adSpend: "254,024,562", adRevenue: "254,024,562", roas: "254%" },
    salesOptimization: { adSpend: "254,024,562", adRevenue: "254,024,562", roas: "254%" },
    manualPerformance: { adSpend: "254,024,562", adRevenue: "254,024,562", roas: "254%" },
    easyStart: { adSpend: "254,024,562", adRevenue: "254,024,562", roas: "254%" },
};

// 테이블에 들어갈 샘플 데이터
const productReportData = [
    { type: '매출최적화', name: '반팔티', adSpend: '4,550,370', adRevenue: '84,550,370', roas: '350%' },
    { type: '수동성과형', name: '반팔티', adSpend: '4,550,370', adRevenue: '84,550,370', roas: '350%' },
    { type: '매출최적화', name: '반팔티', adSpend: '4,550,370', adRevenue: '84,550,370', roas: '350%' },
    { type: '수동성과형', name: '반팔티', adSpend: '4,550,370', adRevenue: '84,550,370', roas: '350%' },
    { type: '매출최적화', name: '반팔티', adSpend: '4,550,370', adRevenue: '84,550,370', roas: '350%' },
    { type: '수동성과형', name: '반팔티', adSpend: '4,550,370', adRevenue: '84,550,370', roas: '350%' },
];

const marginReportData = [
    { name: '반팔티', adMargin: '4,550,370', netProfit: '84,550,370' },
    { name: '반팔티', adMargin: '4,550,370', netProfit: '84,550,370' },
    { name: '반팔티', adMargin: '4,550,370', netProfit: '84,550,370' },
    { name: '반팔티', adMargin: '4,550,370', netProfit: '84,550,370' },
    { name: '반팔티', adMargin: '4,550,370', netProfit: '84,550,370' },
    { name: '반팔티', adMargin: '4,550,370', netProfit: '84,550,370' },
];


const CampaignAnalysis = () => {
    const [activeTab, setActiveTab] = useState('total');

    // 탭 클릭 핸들러
    const handleTabClick = (tabKey) => {
        setActiveTab(tabKey);
    };

    // 데이터와 라벨을 기반으로 카드(탭)을 렌더링하는 함수
    const renderCampaignCard = (key, label) => (
        <button
            className={`CampaignCard ${activeTab === key ? 'active-tab' : ''}`}
            onClick={() => handleTabClick(key)}
        >
            <span className="CampaignCard_label">{label}</span>
            <div className="CampaignCard_content">
                <div className="MetricRow">
                    <span className="MetricLabel">광고비</span>
                    <span className="MetricValue">{campaignData[key].adSpend}</span>
                </div>
                <div className="MetricRow">
                    <span className="MetricLabel">광고 매출</span>
                    <span className="MetricValue">{campaignData[key].adRevenue}</span>
                </div>
                <div className="MetricRow">
                    <span className="MetricLabel">ROAS</span>
                    <span className="MetricValue">{campaignData[key].roas}</span>
                </div>
            </div>
        </button>
    );

    return (
        <div className="CampaignAnalysisPage">
            {/* --- 페이지 헤더 --- */}
            <div className="PageHeader">
                <h2 className="PageTitle">광고 캠페인 분석</h2>
                <div className="DatePicker">
                    <span>2025.04.01</span>
                    <span>-</span>
                    <span>2025.04.30</span>
                </div>
            </div>

            {/* --- 상단 4개 카드 --- */}
            <div className="CampaignCardContainer">
                {renderCampaignCard('total', '전체')}
                {renderCampaignCard('salesOptimization', '매출 최적화')}
                {renderCampaignCard('manualPerformance', '수동 성과형')}
                {renderCampaignCard('easyStart', '간편 매출 스타트')}
            </div>

            {/* --- 하단 2개 콘텐츠 블록 --- */}
            <div className="ContentGrid">
                {/* 상품 보고서 블록 */}
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
                                        <td><span className={`Tag ${item.type === '매출최적화' ? 'TagBlue' : 'TagGreen'}`}>{item.type}</span></td>
                                        <td>{item.name} <span className="ExternalLinkIcon">↗</span></td>
                                        <td>{item.adSpend}</td>
                                        <td>{item.adRevenue}</td>
                                        <td>{item.roas}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 마진 보고서 블록 */}
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
                                {marginReportData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name} <span className="ExternalLinkIcon">↗</span></td>
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