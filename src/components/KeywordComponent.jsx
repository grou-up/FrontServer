import React, { useState } from "react";
import "../styles/KeywordComponent.css"; // 스타일 파일
import { ArrowDownUp } from 'lucide-react';


const KeywordComponent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false); // 전체 선택 상태
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // 정렬 상태

    const keywords = [
        { keyword: "안경케이스", impressions: 8665, clicks: 146, clickRate: 1.7, orders: 12, conversionRate: 8.2, cpc: 356, adCost: 51968, adRevenue: 114800, roas: 221 },
        { keyword: "휴대용안경케이스", impressions: 2011, clicks: 47, clickRate: 2.3, orders: 3, conversionRate: 6.4, cpc: 423, adCost: 19879, adRevenue: 32800, roas: 165 },
        { keyword: "선글라스케이스", impressions: 1305, clicks: 32, clickRate: 2.5, orders: 2, conversionRate: 6.3, cpc: 346, adCost: 11058, adRevenue: 16400, roas: 148 },
        { keyword: "안경집케이스", impressions: 834, clicks: 23, clickRate: 2.8, orders: 2, conversionRate: 8.7, cpc: 448, adCost: 10302, adRevenue: 16400, roas: 159 },
    ];

    const filteredKeywords = keywords
        .filter((item) => item.keyword.includes(searchTerm))
        .sort((a, b) => {
            if (!sortConfig.key) return 0;
            const order = sortConfig.direction === "asc" ? 1 : -1;
            return a[sortConfig.key] > b[sortConfig.key]
                ? order
                : a[sortConfig.key] < b[sortConfig.key]
                ? -order
                : 0;
        });

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const handleCheckboxChange = (keyword) => {
        setSelectedKeywords((prev) =>
            prev.includes(keyword)
                ? prev.filter((item) => item !== keyword)
                : [...prev, keyword]
        );
    };

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedKeywords([]);
        } else {
            setSelectedKeywords(filteredKeywords.map((item) => item.keyword));
        }
        setIsAllSelected(!isAllSelected);
    };

    const handleCopy = () => {
        const keywordsToCopy = selectedKeywords.join("\n");
        navigator.clipboard.writeText(keywordsToCopy).then(() => {
            alert("복사 완료: " + keywordsToCopy);
        });
    };

    return (
        <div className="keyword-component">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="키워드를 입력하세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-button">검색</button>
                <div className="button-group">
                    <button className="action-button" onClick={handleCopy}>
                        복사하기
                    </button>
                    <button className="action-button">제외 키워드 등록</button>
                    <button className="action-button">수동 입력가 관리</button>
                </div>
            </div>
            <table>
            <thead>
                <tr>
                    <th onClick={() => handleSort("keyword")} >
                        키워드
                        <ArrowDownUp />
                    </th>
                    <th onClick={() => handleSort("impressions")} >
                        노출
                        <ArrowDownUp />
                    </th>
                    <th onClick={() => handleSort("clicks")}>
                        클릭
                        <ArrowDownUp />
                    </th>
                    <th onClick={() => handleSort("clickRate")} >
                        클릭률
                        <ArrowDownUp />
                    </th>
                    <th onClick={() => handleSort("orders")} >
                        주문
                        <ArrowDownUp />
                    </th>
                    <th onClick={() => handleSort("conversionRate")} >
                        전환율
                        <ArrowDownUp />
                    </th>
                    <th onClick={() => handleSort("cpc")} >
                        CPC
                        <ArrowDownUp />
                    </th>
                    <th onClick={() => handleSort("adCost")} >
                        광고비
                        <ArrowDownUp />
                    </th>
                    <th onClick={() => handleSort("adRevenue")} >
                        광고매출
                        <ArrowDownUp />
                    </th>
                    <th onClick={() => handleSort("roas")} >
                        ROAS
                        <ArrowDownUp />
                    </th>
                    <th>
                        <input
                            type="checkbox"
                            checked={isAllSelected && selectedKeywords.length === filteredKeywords.length}
                            onChange={handleSelectAll}
                        />
                    </th>
                </tr>
            </thead>
                <tbody>
                    {filteredKeywords.map((item, index) => (
                        <tr key={index}>
                            
                            <td>{item.keyword}</td>
                            <td>{item.impressions}</td>
                            <td>{item.clicks}</td>
                            <td>{item.clickRate}%</td>
                            <td>{item.orders}</td>
                            <td>{item.conversionRate}%</td>
                            <td>{item.cpc}</td>
                            <td>{item.adCost}</td>
                            <td>{item.adRevenue}</td>
                            <td>{item.roas}%</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedKeywords.includes(item.keyword)}
                                    onChange={() => handleCheckboxChange(item.keyword)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default KeywordComponent;
