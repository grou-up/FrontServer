import React, { useEffect, useState } from "react";
import { getMargin } from "../../services/margin";
import usePaginationAndSorting from "../../hooks/usePaginationAndSorting";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/SalesReport.css";
import { ArrowRight, ArrowLeft } from "lucide-react";

const SalesReport = () => {
    const [date, setDate] = useState(() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday; // 기본값: 어제 날짜
    });

    const [data, setData] = useState([]);
    const { paginatedData, changeSort, changePage, totalPages, page, sortConfig } =
        usePaginationAndSorting({ data, itemsPerPage: 7 });

    // API 데이터 호출
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getMargin({ date: date.toISOString().split("T")[0] });
                setData(response.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [date]);

    // 날짜를 하루 전으로 이동
    const handlePrevDay = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 1);
        setDate(newDate);
    };

    // 날짜를 하루 후로 이동
    const handleNextDay = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        setDate(newDate);
    };

    return (
        <div className="sales-report">
            <h3 className="report-title">매출 보고서</h3>
            <div className="date-controls">
                <button className="date-button" onClick={handlePrevDay}>
                    <ArrowLeft />
                </button>
                <DatePicker
                    selected={date}
                    onChange={(date) => setDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="date-picker"
                />
                <button className="date-button" onClick={handleNextDay}>
                    <ArrowRight />
                </button>
            </div>
            <table className="sales-table">
                <thead>
                    <tr>
                        <th onClick={() => changeSort("campaignName")}>
                            캠페인 이름 {sortConfig?.key === "campaignName" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                        </th>
                        <th onClick={() => changeSort("yesterdaySales")}>
                            어제 매출 {sortConfig?.key === "yesterdaySales" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                        </th>
                        <th onClick={() => changeSort("todaySales")}>
                            오늘 매출 {sortConfig?.key === "todaySales" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                        </th>
                        <th onClick={() => changeSort("differentSales")}>
                            매출 차이 {sortConfig?.key === "differentSales" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.campaignName}</td>
                            <td>{item.yesterdaySales}</td>
                            <td>{item.todaySales}</td>
                            <td>{item.differentSales}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-controls">
                <button
                    className="pagination-button"
                    onClick={() => changePage(page - 1)}
                    disabled={page <= 1}
                >
                    이전
                </button>
                <span className="pagination-display">
                    {page} / {totalPages}
                </span>
                <button
                    className="pagination-button"
                    onClick={() => changePage(page + 1)}
                    disabled={page >= totalPages}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default SalesReport;
