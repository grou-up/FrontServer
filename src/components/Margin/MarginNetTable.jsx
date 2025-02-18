import React, { useEffect, useState, useCallback } from "react";
import { getNetProfit } from "../../services/margin"; // API 요청 함수 가져오기
import "../../styles/margin/MarginNetTable.css";
import { formatNumber } from "../../utils/formatUtils";
import "../../styles/numberColor.css";

const MarginNetTable = ({ startDate, endDate }) => {
    const [dailyNetProfitData, setDailyNetProfitData] = useState([]);
    const [fullDateRange, setFullDateRange] = useState([]);
    const [isLoading, setIsLoading] = useState(false);  // 로딩 상태 추가
    const [isDataFetched, setIsDataFetched] = useState(false);  // 데이터가 이미 호출된 상태를 추적

    const generateDateRange = useCallback(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dates = [];

        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
            const month = (d.getMonth() + 1).toString().padStart(2, '0'); // 월을 2자리로
            const day = d.getDate().toString().padStart(2, '0'); // 일을 2자리로
            dates.push(`${month}-${day}`); // MM-DD 형식으로 추가
        }

        setFullDateRange(dates);
    }, [startDate, endDate]);

    useEffect(() => {
        const fetchData = async () => {
            if (isLoading || isDataFetched) return;  // 로딩 중이거나 데이터가 이미 호출되었으면 return

            setIsLoading(true);  // 로딩 시작
            try {
                const response = await getNetProfit({ startDate, endDate });
                const data = response.data;
                if (Array.isArray(data)) {
                    setDailyNetProfitData(data);
                    setIsDataFetched(true);  // 데이터 호출 완료 표시
                } else {
                    console.error("데이터 형식이 올바르지 않습니다:", data);
                }
            } catch (error) {
                console.error("데이터를 가져오는 중 오류 발생:", error);
            } finally {
                setIsLoading(false);  // 로딩 종료
            }
        };

        fetchData();
        generateDateRange(); // 날짜 범위 생성
    }, [startDate, endDate, generateDateRange, isLoading, isDataFetched]); // 필요한 의존성 추가

    const getMarginDataForDate = (date) => {
        const originalDate = `${new Date(startDate).getFullYear()}-${date.replace('-', '-')}`;
        const found = dailyNetProfitData.find(item => item.marDate === originalDate);
        return found ? Math.floor(found.margin) : 0;
    };

    const getTotalMargin = () => {
        return fullDateRange.reduce((total, date) => total + getMarginDataForDate(date), 0);
    };

    const getSalesDifferenceClass = (difference) => {
        if (difference > 0) return "positive-profit";
        if (difference < 0) return "negative-profit";
        return "";
    };

    const totalMargin = getTotalMargin();  // 총 합계 계산

    return (
        <div>
            일별 전체 합산 금액
            <div className="marginresult-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>날짜</th>
                            <th>합계</th>
                            {fullDateRange.map((date) => (
                                <th key={date}>{date}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>마진</td>
                            <td className={getSalesDifferenceClass(totalMargin)}>
                                {formatNumber(totalMargin)}
                            </td>
                            {fullDateRange.map((date) => {
                                const margin = getMarginDataForDate(date);
                                return (
                                    <td key={date} className={getSalesDifferenceClass(margin)}>
                                        {formatNumber(margin)}
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MarginNetTable;