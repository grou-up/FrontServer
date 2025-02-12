import React, { useState } from "react";
import "../styles/KeywordComponent.css"; // 스타일 파일
import "../styles/Table.css";
import SortableHeader from '../components/SortableHeader';

const KeywordComponent = ({ selectedKeywords, setSelectedKeywords, keywords, loading, error }) => {
    const [editableBids, setEditableBids] = useState({}); // 각 키워드에 대한 입찰가 상태 관리
    const [sortConfig, setSortConfig] = useState({ key: 'keyKeyword', direction: 'asc' }); // 정렬 상태 관리

    const filteredKeywords = keywords
        .sort((a, b) => {
            if (!sortConfig.key) return 0;
            const order = sortConfig.direction === "asc" ? 1 : -1;
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            // 값이 숫자인 경우
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return (aValue - bValue) * order;
            }

            // 값이 문자열인 경우
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return aValue.localeCompare(bValue) * order;
            }

            return 0;
        });

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const handleCheckboxChange = (item) => {
        const keywordData = {
            keyword: item.keyKeyword,
            bid: editableBids[item.keyKeyword] || item.keyCpc // 사용자가 입력한 값 또는 기본값 사용
        };

        setSelectedKeywords((prev) => {
            if (prev.some((kw) => kw.keyword === keywordData.keyword)) {
                return prev.filter((kw) => kw.keyword !== keywordData.keyword);
            } else {
                return [...prev, keywordData];
            }
        });
    };

    const handleBidChange = (keyword, value) => {
        setEditableBids((prev) => ({
            ...prev,
            [keyword]: value // 키워드에 대한 입찰가 업데이트
        }));
    };

    if (loading) return <div>Loading...</div>; // 로딩 상태 표시
    if (error) return <div>{error}</div>; // 에러 상태 표시

    return (
        <div className="keyword-table">
            <table>
                <thead>
                    <tr>
                        <SortableHeader label="키워드" sortKey="keyKeyword" onSort={handleSort} />
                        <SortableHeader label="노출" sortKey="keyImpressions" onSort={handleSort} />
                        <SortableHeader label="클릭" sortKey="keyClicks" onSort={handleSort} />
                        <SortableHeader label="클릭률" sortKey="keyClickRate" onSort={handleSort} />
                        <SortableHeader label="주문" sortKey="keyTotalSales" onSort={handleSort} />
                        <SortableHeader label="전환율" sortKey="keyCvr" onSort={handleSort} />
                        <SortableHeader label="광고매출" sortKey="keyAdsales" onSort={handleSort} />
                        <SortableHeader label="광고비" sortKey="keyAdcost" onSort={handleSort} />
                        <SortableHeader label="ROAS" sortKey="keyRoas" onSort={handleSort} />
                        <SortableHeader label="CPC" sortKey="keyCpc" onSort={handleSort} />
                        <SortableHeader label="설정 입찰가" sortKey="bid" onSort={handleSort} />
                        <th>
                            <input
                                type="checkbox"
                                checked={selectedKeywords.length === filteredKeywords.length}
                                onChange={() => {
                                    const allKeywords = filteredKeywords.map(item => ({
                                        keyword: item.keyKeyword,
                                        bid: editableBids[item.keyKeyword] || item.keyCpc // 사용자가 입력한 값 또는 기본값 사용
                                    }));
                                    setSelectedKeywords(allKeywords);
                                }}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredKeywords.map((item, index) => (
                        <tr key={index}>
                            <td>{item.keyKeyword}</td>
                            <td>{item.keyImpressions.toLocaleString()}</td> {/* 천 단위 구분 기호 추가 */}
                            <td>{item.keyClicks.toLocaleString()}</td> {/* 천 단위 구분 기호 추가 */}
                            <td>{item.keyClickRate.toLocaleString()}%</td> {/* 천 단위 구분 기호 추가 */}
                            <td>{item.keyTotalSales.toLocaleString()}</td> {/* 천 단위 구분 기호 추가 */}
                            <td>{item.keyCvr.toLocaleString()}%</td> {/* 천 단위 구분 기호 추가 */}
                            <td>{item.keyAdsales.toLocaleString()}원</td> {/* 천 단위 구분 기호 추가 */}
                            <td>{item.keyAdcost.toLocaleString()}원</td> {/* 천 단위 구분 기호 추가 */}
                            <td>{item.keyRoas.toLocaleString()}%</td> {/* 천 단위 구분 기호 추가 */}
                            <td>{item.keyCpc.toLocaleString()}원</td> {/* 천 단위 구분 기호 추가 */}
                            <td>
                                <input
                                    type="number" // 숫자 입력 필드로 변경
                                    style={{
                                        border: '1px solid #007bff', // 테두리 색상
                                        borderRadius: '4px', // 테두리 둥글게
                                        padding: '4px', // 여백 추가
                                        width: '100%', // 너비 100%로 설정
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // 그림자 추가
                                        transition: 'border-color 0.3s, box-shadow 0.3s', // 부드러운 변화 효과
                                    }}
                                    value={editableBids[item.keyKeyword] !== undefined ? editableBids[item.keyKeyword] : Math.round(item.keyCpc)} // 사용자가 입력한 값 또는 기본값 사용
                                    onChange={(e) => handleBidChange(item.keyKeyword, e.target.value)} // 입력값 변경 시 상태 업데이트
                                />
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedKeywords.some(kw => kw.keyword === item.keyKeyword)} // keyword로 체크 여부 확인
                                    onChange={() => handleCheckboxChange(item)} // item을 인자로 전달
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
