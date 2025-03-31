import React, { useEffect, useState } from "react";
import "../../styles/margin/MarginDataTable.css";
import { getMarginByCampaignId } from "../../services/margin";
import { formatNumber } from "../../utils/formatUtils";

const MarginDataTable = ({ startDate, endDate, campaignId, onDataChange }) => {
    const [data, setData] = useState([]); // 데이터 상태
    const [modifiedData, setModifiedData] = useState({}); // 변경된 데이터 상태 추가

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
        { optionName: "목표효율", key: "marTargetEfficiency", editable: true },
        { optionName: "광고예산", key: "marAdBudget", editable: true },
        { optionName: "광고수익률", key: "marAdRevenue" },
        { optionName: "집행광고비 * 1.1", key: "marAdCost" },
        { optionName: "CPC 단가", key: "marCpcUnitCost" },
        { optionName: "노출수", key: "marImpressions" },
        { optionName: "클릭률", key: "marClicks" },
        { optionName: "전환률", key: "marAdConversionSalesCount" },
        { optionName: "광고 전환 판매 수", key: "marAdConversionSales" },
        { optionName: "실제 판매 수", key: "marActualSales" },
        { optionName: "반품 개수", key: "marReturnCount" },
        { optionName: "반품 비용", key: "marReturnCost" },
        { optionName: "광고 마진", key: "marAdMargin" },
        { optionName: "순이익", key: "marNetProfit" },
    ];
    const handleInputChange = (e, fullDate, key) => {
        const newValue = e.target.value;
        setData(prevData =>
            prevData.map(item =>
                item.marDate === fullDate ? { ...item, [key]: Number(newValue) } : item
            )
        );
        // 변경된 데이터 전달
        setModifiedData(prev => {
            const updatedData = {
                ...(prev[fullDate] || {}),
                marDate: fullDate,
                [key]: Number(newValue) // 변경된 값 저장
            };

            const itemForDate = data.find(item => item.marDate === fullDate);

            // 광고예산이 변경된 경우 목표효율 포함
            if (key === "marAdBudget" && itemForDate) {
                updatedData.marTargetEfficiency = itemForDate.marTargetEfficiency;
            }

            // 목표효율이 변경된 경우 광고예산 포함
            if (key === "marTargetEfficiency" && itemForDate) {
                updatedData.marAdBudget = itemForDate.marAdBudget;
            }
            updatedData.id = itemForDate.id;
            return {
                ...prev,
                [fullDate]: updatedData // 전체 업데이트된 데이터 반환
            };
        });

        // 부모 컴포넌트에 변경된 데이터 전달
        onDataChange(modifiedData);
    };


    return (
        <div className="table-container"> {/* 스크롤을 위한 컨테이너 추가 */}
            <table className="campaign-data-table">
                <thead>
                    <tr>
                        <th className="option-name-header sticky-column"></th>
                        {dateRange.map(({ displayDate }) => (
                            <th key={displayDate}>{displayDate}</th>
                        ))}
                        <th className="sticky-column total-column">총합</th> {/* 총합 열 추가 */}
                    </tr>
                </thead>
                <tbody>
                    {options.map((option) => (
                        <tr key={option.optionName}>
                            <td className="sticky-column">{option.optionName}</td>
                            {dateRange.map(({ fullDate }) => {
                                const itemForDate = data.find(item => item.marDate === fullDate);
                                let value = '-';

                                if (itemForDate) {
                                    if (option.key === "marAdRevenue") {
                                        value = itemForDate.marAdCost > 0
                                            ? ((itemForDate.marAdMargin / itemForDate.marAdCost) * 100).toFixed(2) + '%'
                                            : '0.00%';
                                    } else if (option.key === "marAdCost") {
                                        value = formatNumber(Math.round(itemForDate.marAdCost * 1.1));
                                    } else if (option.key === "marCpcUnitCost") {
                                        value = itemForDate.marClicks > 0
                                            ? formatNumber(Math.round(itemForDate.marAdCost / itemForDate.marClicks))
                                            : '0';
                                    } else if (option.key === "marImpressions") {
                                        value = formatNumber(itemForDate.marImpressions);
                                    } else if (option.key === "marClicks") {
                                        value = itemForDate.marImpressions > 0
                                            ? ((itemForDate.marClicks / itemForDate.marImpressions) * 100).toFixed(2) + '%'
                                            : '0%';
                                    } else if (option.key === "marAdConversionSalesCount") {
                                        value = itemForDate.marClicks > 0
                                            ? formatNumber(((itemForDate.marAdConversionSalesCount / itemForDate.marClicks) * 100).toFixed(2)) + '%'
                                            : '0%';
                                    } else if (option.key === "marAdMargin") {
                                        value = formatNumber(itemForDate.marAdMargin);
                                    } else if (option.key === "marNetProfit") {
                                        value = formatNumber(Math.round(itemForDate.marNetProfit));
                                    } else if (option.key === "marReturnCost") {
                                        value = formatNumber(Math.round(itemForDate.marReturnCost));
                                    }
                                    else {
                                        value = itemForDate[option.key] || '-';
                                    }
                                }

                                let cellClass = "";
                                if (option.key === "marNetProfit") {
                                    const isNetProfitNegative = itemForDate && itemForDate.marNetProfit < 0;
                                    const isNetProfitZero = itemForDate && itemForDate.marNetProfit === 0;
                                    cellClass = isNetProfitNegative ? "negative-profit" : (isNetProfitZero ? "" : "positive-profit");
                                } else if (option.key === "marReturnCount") {
                                    cellClass = itemForDate && itemForDate.marReturnCount > 0 ? "red-return-count" : "";
                                }

                                return (
                                    <td key={fullDate} className={cellClass}>
                                        {option.editable && itemForDate ? (
                                            <input
                                                type="number"
                                                value={itemForDate[option.key] || ''}
                                                onChange={(e) => handleInputChange(e, fullDate, option.key)}
                                                placeholder="입력"
                                            />
                                        ) : (
                                            value
                                        )}
                                    </td>
                                );
                            })}
                            <td className="sticky-column total-column">
                                {["marAdRevenue", "marClicks", "marAdConversionSalesCount"].includes(option.key) ? (
                                    formatNumber(
                                        Math.floor(data.reduce((total, item) => {
                                            if (item.marAdCost > 0) {
                                                if (option.key === "marAdRevenue") {
                                                    return total + ((item.marAdMargin / item.marAdCost) * 100) || 0;
                                                } else if (option.key === "marClicks") {
                                                    return total + ((item.marClicks / item.marImpressions) * 100) || 0;
                                                } else if (option.key === "marAdConversionSalesCount") {
                                                    return total + ((item.marAdConversionSalesCount / item.marClicks) * 100) || 0;
                                                }
                                            }
                                            return total;
                                        }, 0) / dateRange.length)
                                    ) + '%'
                                ) : option.key === "marCpcUnitCost" ? (
                                    formatNumber(
                                        Math.floor(data.reduce((total, item) => {
                                            if (item.marClicks > 0) {
                                                return total + (item.marAdCost / item.marClicks) || 0;
                                            }
                                            return total;
                                        }, 0) / dateRange.length)
                                    )
                                ) : (
                                    formatNumber(
                                        Math.floor(data.reduce((total, item) => {
                                            if (["marAdCost", "marImpressions", "marActualSales", "marReturnCount", "marAdMargin", "marNetProfit", "marAdConversionSales", "marReturnCost"].includes(option.key)) {
                                                return total + (item[option.key] || 0);
                                            }
                                            return total;
                                        }, 0))
                                    )
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MarginDataTable;
