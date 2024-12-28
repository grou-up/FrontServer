import React, { useState, useEffect } from "react";
import { getCampaignDetails } from "../services/capaigndetails";
import { formatNumber } from "../utils/formatUtils"; // 유틸리티 함수 가져오기
import "../styles/Table.css";
import SortableHeader from '../components/SortableHeader'; 

const CampaignOptionDetailsComponent = ({ campaignId }) => {
    
    
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // 정렬 상태
    const [CampaignDetails, setCampaignDetails] = useState([]); // 키워드 데이터 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    useEffect(() => {
        const fetchCampaignDetails = async () => {
            setLoading(true);
            try {
                const start = "2024-11-01";
                const end = "2024-11-24";
                const response = await getCampaignDetails({ start, end, campaignId });
                setCampaignDetails(response.data || []); // API 응답에서 키워드 데이터 설정
            } catch (error) {
                setError("해당 옵션의 데이터가 존재 하지 않습니다.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaignDetails();
    }, [campaignId]); // campaignId가 변경될 때마다 호출
    
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };


    // CampaignDetails
    const filteredCampaignDetails = CampaignDetails
        .sort((a, b) => {
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
                        <SortableHeader label="노출" sortKey="copImpressions" onSort={handleSort} />
                        <SortableHeader label="클릭수" sortKey="copClicks" onSort={handleSort} />
                        <SortableHeader label="클릭률" sortKey="copClickRate" onSort={handleSort} />
                        <SortableHeader label="전환율" sortKey="copCvr" onSort={handleSort} />
                    </tr>
                </thead>
                <tbody>
                    {filteredCampaignDetails.map((item, index) => (
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
