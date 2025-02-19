import React, { useEffect, useState } from "react";
import "../../styles/margin/MarginDataTable.css";
import { getMarginByCampaignId } from "../../services/margin";
import { formatNumber } from "../../utils/formatUtils";

const MarginDataTable = ({ startDate, endDate, campaignId }) => {
    const [data, setData] = useState([]); // 데이터 상태

    // 날짜 범위 생성
    const dateRange = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
        const yearMonthDay = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 월을 2자리로 포맷
        const day = String(currentDate.getDate()).padStart(2, '0'); // 일을 2자리로 포맷
        dateRange.push({ fullDate: yearMonthDay, displayDate: `${month}-${day}` }); // 객체로 저장
        currentDate.setDate(currentDate.getDate() + 1); // 하루씩 증가
    }

    // 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getMarginByCampaignId({ startDate, endDate, campaignId });
                setData(response.data[0].data); // API 응답에서 데이터 설정
            } catch (error) {
                console.error("데이터를 가져오는 중 오류 발생:", error);
            }
        };

        fetchData();
    }, [startDate, endDate, campaignId]);

    // 고정된 옵션 이름과 백엔드에서 가져온 데이터 매핑
    const options = [
        { optionName: "목표효율", key: "marTargetEfficiency" },
        { optionName: "광고예산", key: "marAdBudget" },
        { optionName: "광고수익률", key: "marAdRevenue" },
        { optionName: "집행광고비 * 1.1", key: "marAdCost" },
        { optionName: "CPC 단가", key: "marCpcUnitCost" },
        { optionName: "노출수", key: "marImpressions" },
        { optionName: "클릭률", key: "marClicks" },
        { optionName: "전환률", key: "marAdConversionSalesCount" },
        { optionName: "광고 전환 판매 수", key: "marAdConversionSales" },
        { optionName: "실제 판매 수", key: "marActualSales" },
        { optionName: "광고 마진", key: "marAdMargin" },
        { optionName: "순이익", key: "marNetProfit" },
    ];

    return (
        <div className="table-container"> {/* 스크롤을 위한 컨테이너 추가 */}
            <table className="campaign-data-table">
                <thead>
                    <tr>
                        <th className="option-name-header sticky-column"></th>
                        {dateRange.map(({ displayDate }) => (
                            <th key={displayDate}>{displayDate}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {options.map((option) => (
                        <tr key={option.optionName}>
                            <td className="sticky-column">{option.optionName}</td>
                            {dateRange.map(({ fullDate }) => {
                                // 해당 날짜에 맞는 데이터 찾기
                                const itemForDate = data.find(item => item.marDate === fullDate);
                                let value = '-'; // 기본값

                                if (itemForDate) {
                                    if (option.key === "marAdRevenue") { // 광고 수익률
                                        value = ((itemForDate.marAdMargin / itemForDate.marAdCost) * 100).toFixed(2) + '%';
                                    } else if (option.key === "marAdCost") { // 집행광고비 * 10
                                        value = formatNumber(Math.round(itemForDate.marAdCost * 1.1));
                                    } else if (option.key === "marCpcUnitCost") { // CPC 단가
                                        value = formatNumber(Math.round(itemForDate.marAdCost / itemForDate.marClicks));
                                    } else if (option.key === "marImpressions") {
                                        value = formatNumber(itemForDate.marImpressions);
                                    } else if (option.key === "marClicks") { // 클릭률
                                        value = ((itemForDate.marClicks / itemForDate.marImpressions) * 100).toFixed(2) + '%';
                                    } else if (option.key === "marAdConversionSalesCount") {
                                        value = formatNumber(((itemForDate.marAdConversionSalesCount / itemForDate.marClicks) * 100).toFixed(2)) + '%';
                                    } else if (option.key === "marAdMargin") {
                                        value = formatNumber(itemForDate.marAdMargin);
                                    } else if (option.key === "marNetProfit") { // 순이익
                                        value = formatNumber(Math.round(itemForDate.marNetProfit));
                                    } else {
                                        // 기본 데이터 값
                                        value = itemForDate[option.key] || '-';
                                    }
                                }
                                // 순이익 열에만 색상 적용
                                const isNetProfitColumn = option.key === "marNetProfit";
                                const isNetProfitNegative = isNetProfitColumn && itemForDate && itemForDate.marNetProfit < 0;
                                const isNetProfitZero = isNetProfitColumn && itemForDate && itemForDate.marNetProfit === 0;

                                return (
                                    <td
                                        key={fullDate}
                                        className={
                                            isNetProfitColumn
                                                ? (isNetProfitNegative ? "negative-profit" :
                                                    isNetProfitZero ? "" : "positive-profit")
                                                : ""
                                        }
                                    >
                                        {value}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MarginDataTable;
