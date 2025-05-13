import React, { useEffect, useState } from "react";
import { getDailyMarginSummary } from '../../services/margin';
import "../../styles/Dashboard/DashboardMarginReport.css";
import { formatInteger } from "../../utils/formatUtils";
const DashboardMarginReport = ({ selectedDate }) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDailyMarginSummary({ date: selectedDate });
                setData(response.data || []);
            } catch (error) {
                console.error("Error fetching margin summary:", error);
            }
        };
        if (selectedDate) {
            fetchData();
        }
    }, [selectedDate]);


    return (
        <div className="dashboard-card dashboard-margin-report">
            <div className="card-label">마진 보고서</div>
            <div className="margin-report-table">
                <table className="margin-table">
                    <thead>
                        <tr>
                            <th>캠페인 이름</th>
                            <th>광고 마진</th>
                            <th>순 이익</th>
                        </tr>
                    </thead>
                </table>
                <div className="margin-table-body-scroll">
                    <table className="margin-table">
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan="3">일일 보고서를 넣어주세요.</td>
                                </tr>
                            ) : (
                                data.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.marProductName}</td>
                                        <td>{formatInteger(item.marAdMargin)}</td>
                                        <td className={item.marNetProfit < 0 ? 'text-red' : ''}>
                                            {formatInteger(item.marNetProfit)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardMarginReport;
