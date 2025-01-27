import React from 'react';

const StatTable = ({ search, nonSearch }) => {
    // 계산 함수
    const calculateClickRate = (clicks, impressions) => {
        return impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : 0;
    };

    const calculateConversionRate = (sales, clicks) => {
        return clicks > 0 ? ((sales / clicks) * 100).toFixed(2) : 0;
    };

    const calculateCPC = (adcost, clicks) => {
        return clicks > 0 ? (adcost / clicks).toFixed(0) : 0;
    };

    const calculateCPM = (adcost, impressions) => {
        return impressions > 0 ? ((adcost / impressions) * 1000).toFixed(0) : 0;
    };

    const calculateROAS = (adsales, adcost) => {
        return adcost > 0 ? ((adsales / adcost) * 100).toFixed(2) : 0;
    };

    const calculateCostPerConversion = (adcost, totalSales) => {
        return totalSales > 0 ? (adcost / totalSales).toFixed(0) : 0;
    };

    // 숫자를 보기 좋게 포맷팅하는 함수
    const formatNumber = (num) => {
        return new Intl.NumberFormat('ko-KR').format(num);
    };

    return (
        <div>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th>노출 영역</th>
                        <th>광고비</th>
                        <th>광고매출</th>
                        <th>클릭수</th>
                        <th>노출수</th>
                        <th>총 주문</th>
                        <th>클릭률</th>
                        <th>전환율</th>
                        <th>CPC</th>
                        <th>CPM</th>
                        <th>ROAS</th>
                        <th>전환 당 비용</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>검색</td>
                        <td>{formatNumber(search?.keyAdcost || 0)}원</td>
                        <td>{formatNumber(search?.keyAdsales || 0)}원</td>
                        <td>{formatNumber(search?.keyClicks || 0)}</td>
                        <td>{formatNumber(search?.keyImpressions || 0)}</td>
                        <td>{formatNumber(search?.keyTotalSales || 0)}</td>
                        <td>{calculateClickRate(search?.keyClicks || 0, search?.keyImpressions || 0)}%</td>
                        <td>{calculateConversionRate(search?.keyTotalSales || 0, search?.keyClicks || 0)}%</td>
                        <td>{formatNumber(calculateCPC(search?.keyAdcost || 0, search?.keyClicks || 0))}원</td>
                        <td>{formatNumber(calculateCPM(search?.keyAdcost || 0, search?.keyImpressions || 0))}원</td>
                        <td>{calculateROAS(search?.keyAdsales || 0, search?.keyAdcost || 0)}%</td>
                        <td>{formatNumber(calculateCostPerConversion(search?.keyAdcost || 0, search?.keyTotalSales || 0))}원</td>
                    </tr>
                    <tr>
                        <td>비 검색</td>
                        <td>{formatNumber(nonSearch?.keyAdcost || 0)}원</td>
                        <td>{formatNumber(nonSearch?.keyAdsales || 0)}원</td>
                        <td>{formatNumber(nonSearch?.keyClicks || 0)}</td>
                        <td>{formatNumber(nonSearch?.keyImpressions || 0)}</td>
                        <td>{formatNumber(nonSearch?.keyTotalSales || 0)}</td>
                        <td>{calculateClickRate(nonSearch?.keyClicks || 0, nonSearch?.keyImpressions || 0)}%</td>
                        <td>{calculateConversionRate(nonSearch?.keyTotalSales || 0, nonSearch?.keyClicks || 0)}%</td>
                        <td>{formatNumber(calculateCPC(nonSearch?.keyAdcost || 0, nonSearch?.keyClicks || 0))}원</td>
                        <td>{formatNumber(calculateCPM(nonSearch?.keyAdcost || 0, nonSearch?.keyImpressions || 0))}원</td>
                        <td>{calculateROAS(nonSearch?.keyAdsales || 0, nonSearch?.keyAdcost || 0)}%</td>
                        <td>{formatNumber(calculateCostPerConversion(nonSearch?.keyAdcost || 0, nonSearch?.keyTotalSales || 0))}원</td>
                    </tr>
                    <tr>
                        <td>합계</td>
                        <td>{formatNumber((search?.keyAdcost || 0) + (nonSearch?.keyAdcost || 0))}원</td>
                        <td>{formatNumber((search?.keyAdsales || 0) + (nonSearch?.keyAdsales || 0))}원</td>
                        <td>{formatNumber((search?.keyClicks || 0) + (nonSearch?.keyClicks || 0))}</td>
                        <td>{formatNumber((search?.keyImpressions || 0) + (nonSearch?.keyImpressions || 0))}</td>
                        <td>{formatNumber((search?.keyTotalSales || 0) + (nonSearch?.keyTotalSales || 0))}</td>
                        <td>{calculateClickRate((search?.keyClicks || 0) + (nonSearch?.keyClicks || 0), (search?.keyImpressions || 0) + (nonSearch?.keyImpressions || 0))}%</td>
                        <td>{calculateConversionRate((search?.keyTotalSales || 0) + (nonSearch?.keyTotalSales || 0), (search?.keyClicks || 0) + (nonSearch?.keyClicks || 0))}%</td>
                        <td>{formatNumber(calculateCPC((search?.keyAdcost || 0) + (nonSearch?.keyAdcost || 0), (search?.keyClicks || 0) + (nonSearch?.keyClicks || 0)))}원</td>
                        <td>{formatNumber(calculateCPM((search?.keyAdcost || 0) + (nonSearch?.keyAdcost || 0), (search?.keyImpressions || 0) + (nonSearch?.keyImpressions || 0)))}원</td>
                        <td>{calculateROAS((search?.keyAdsales || 0) + (nonSearch?.keyAdsales || 0), (search?.keyAdcost || 0) + (nonSearch?.keyAdcost || 0))}%</td>
                        <td>{formatNumber(calculateCostPerConversion((search?.keyAdcost || 0) + (nonSearch?.keyAdcost || 0), (search?.keyTotalSales || 0) + (nonSearch?.keyTotalSales || 0)))}원</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default StatTable;
