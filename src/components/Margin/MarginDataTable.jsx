import React from "react";
import "../../styles/margin/MarginDataTable.css";

const MarginDataTable = ({ startDate, endDate }) => {
    // 날짜 범위 생성
    const dateRange = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    const data = [
        { optionName: "목표효율", values: [10, 20, 30, 40] },
        { optionName: "광고수익률", values: [15, 25, 35, 45] },
        { optionName: "광고예산산", values: [5, 10, 15, 20] },
        { optionName: "집행광고비*10%", values: [2, 4, 6, 8] },
        { optionName: "CPC 단가", values: [1, 2, 3, 4] },
        { optionName: "노출수", values: [100, 200, 300, 400] },
        { optionName: "클릭률", values: [0.1, 0.2, 0.3, 0.4] },
        { optionName: "전환률", values: [0.05, 0.1, 0.15, 0.2] },
        { optionName: "광고 전환 판매 수", values: [50, 60, 70, 80] },
        { optionName: "실제 판매 수", values: [45, 55, 65, 75] },
        { optionName: "광고 마진", values: [20, 30, 40, 50] },
        { optionName: "순이익", values: [10, 15, 20, 25] },
    ];

    while (currentDate <= end) {
        dateRange.push(currentDate.toISOString().split('T')[0]); // YYYY-MM-DD 형식으로 추가
        currentDate.setDate(currentDate.getDate() + 1); // 하루씩 증가
    }

    return (
        <div className="table-container"> {/* 스크롤을 위한 컨테이너 추가 */}
            <table className="campaign-data-table">
                <thead>
                    <tr>
                        <th className="option-name-header sticky-column">   </th>
                        {dateRange.map((date) => (
                            <th key={date}>{date}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className="sticky-column">{item.optionName}</td>
                            {item.values.map((value, dateIndex) => (
                                <td key={dateIndex}>{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MarginDataTable;

