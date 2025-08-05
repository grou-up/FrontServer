import React, { useState, useEffect } from "react";
import { getCampaignDetails } from "../services/capaigndetails";
import { formatNumber } from "../utils/formatUtils"; // 유틸리티 함수 가져오기
import "../styles/Table.css";
import SortableHeader from "../components/SortableHeader";

const CampaignOptionDetailsComponent = ({ campaignId, startDate, endDate }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // 정렬 상태
    const [campaignDetails, setCampaignDetails] = useState([]); // 키워드 데이터 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    console.log(campaignId, startDate, endDate)
    useEffect(() => {
        const fetchCampaignDetails = async () => {
            if (!startDate || !endDate) {
                setError("시작 날짜와 종료 날짜를 설정해주세요.");
                return;
            }

            setLoading(true);
            try {
                const response = await getCampaignDetails({
                    start: startDate,
                    end: endDate,
                    campaignId
                });
                setCampaignDetails(response.data || []); // API 응답에서 데이터 설정
                setError(null); // 에러 초기화
            } catch (error) {
                setError("데이터를 불러오는 중 오류가 발생했습니다.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaignDetails();
    }, [campaignId, startDate, endDate]); // 날짜가 변경될 때마다 API 호출
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedCampaignDetails = campaignDetails.sort((a, b) => {
        if (!sortConfig.key) return 0; // 정렬 키가 없으면 정렬하지 않음
        const order = sortConfig.direction === "asc" ? 1 : -1;
        return a[sortConfig.key] > b[sortConfig.key]
            ? order
            : a[sortConfig.key] < b[sortConfig.key]
                ? -order
                : 0;
    });

    if (loading) return <div>Loading...</div>; // 로딩 상태 표시
    if (error) return <div>{error}</div>; // 에러 상태 표시

    return (
        <div className="keyword-component">
            <table>
                <thead>
                    <tr>
                        <SortableHeader label="옵션ID" sortKey="id" onSort={handleSort} />
                        <SortableHeader label="옵션명" sortKey="name" onSort={handleSort} />
                        <SortableHeader label="주문수" sortKey="copSales" onSort={handleSort} />
                        <SortableHeader label="광고비" sortKey="copAdcost" onSort={handleSort} />
                        <SortableHeader label="광고매출" sortKey="copAdsales" onSort={handleSort} />
                        <SortableHeader label="ROAS" sortKey="copRoas" onSort={handleSort} />
                        <SortableHeader label="노출" sortKey="copimpressionss" onSort={handleSort} />
                        <SortableHeader label="클릭수" sortKey="copClicks" onSort={handleSort} />
                        <SortableHeader label="클릭률" sortKey="copClickRate" onSort={handleSort} />
                        <SortableHeader label="전환율" sortKey="copCvr" onSort={handleSort} />
                    </tr>
                </thead>
                <tbody>
                    {sortedCampaignDetails.map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{formatNumber(item.copSales)}</td>
                            <td>{formatNumber(item.copAdcost)}</td>
                            <td>{formatNumber(item.copAdsales)}</td>
                            <td>{formatNumber(item.copRoas)}%</td>
                            <td>{formatNumber(item.copImpressions)}</td>
                            <td>{formatNumber(item.copClicks)}</td>
                            <td>{formatNumber(item.copClickRate)}%</td>
                            <td>{formatNumber(item.copCvr)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CampaignOptionDetailsComponent;
