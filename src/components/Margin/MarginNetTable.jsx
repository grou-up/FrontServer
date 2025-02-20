import React, { useEffect, useState, useCallback } from "react";
import { getNetProfit } from "../../services/margin"; // API 요청 함수 가져오기
import "../../styles/margin/MarginNetTable.css";
import { formatNumber } from "../../utils/formatUtils";
import "../../styles/numberColor.css";

const MarginNetTable = ({ startDate, endDate }) => {
    const [dailyNetProfitData, setDailyNetProfitData] = useState([]);
    const [fullDateRange, setFullDateRange] = useState([]);

    const generateDateRange = useCallback(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dates = [];

        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
            // MM-DD 형식으로 변환
            const month = (d.getMonth() + 1).toString().padStart(2, '0'); // 월을 2자리로
            const day = d.getDate().toString().padStart(2, '0'); // 일을 2자리로
            dates.push(`${month}-${day}`); // MM-DD 형식으로 추가
        }

        setFullDateRange(dates);
    }, [startDate, endDate]); // startDate와 endDate에 의존

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getNetProfit({ startDate, endDate }); // getNetProfit 호출
                const data = response.data; // 'data' 배열을 가져옴
                console.log("API 응답 데이터:", data); // 데이터를 콘솔에 출력

                // 데이터가 배열인지 확인
                if (Array.isArray(data)) {
                    setDailyNetProfitData(data); // 데이터 설정
                } else {
                    console.error("데이터 형식이 올바르지 않습니다:", data);
                }
            } catch (error) {
                console.error("데이터를 가져오는 중 오류 발생:", error);
            }
        };

        fetchData();
        generateDateRange(); // 날짜 범위 생성
    }, [startDate, endDate, generateDateRange]); // generateDateRange 추가

    // 날짜별 마진 데이터 생성
    const getMarginDataForDate = (date) => {
        const originalDate = `${new Date(startDate).getFullYear()}-${date.replace('-', '-')}`; // 연도를 포함한 날짜 생성
        const found = dailyNetProfitData.find(item => item.marDate === originalDate);
        return found ? Math.floor(found.margin) : 0; // 데이터가 없으면 0 반환, 소수점 아래를 버림
    };

    // 총 합계 계산
    const getTotalMargin = () => {
        return fullDateRange.reduce((total, date) => total + getMarginDataForDate(date), 0);
    };

    const getSalesDifferenceClass = (difference) => {
        if (difference > 0) return "positive-profit"; // +이면 파란색
        if (difference < 0) return "negative-profit"; // -이면 빨간색
        return ""; // 0이면 기본 스타일
    };

    const totalMargin = getTotalMargin(); // 총 합계 계산

    return (
        <div>
            일별 전체 합산 금액
            <div className="marginresult-table-container"> {/* 테이블 컨테이너 추가 */}
                <table>
                    <thead>
                        <tr>
                            <th>날짜</th>
                            <th>합계</th>
                            {fullDateRange.map((date) => (
                                <th key={date}>{date}</th> // 월일을 헤더로 추가
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>마진</td>
                            <td className={getSalesDifferenceClass(totalMargin)}>
                                {formatNumber(totalMargin)} {/* 첫 번째 열에 총 마진 합계 표시 */}
                            </td>
                            {fullDateRange.map((date) => {
                                const margin = getMarginDataForDate(date);
                                return (
                                    <td key={date} className={getSalesDifferenceClass(margin)}>
                                        {formatNumber(margin)} {/* 날짜에 따른 마진 값 표시 */}
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
