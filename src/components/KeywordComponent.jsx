import React from "react";
import "../styles/KeywordComponent.css"; // 스타일 파일
import "../styles/Table.css";
import SortableHeader from '../components/SortableHeader';

const KeywordComponent = ({ campaignId, startDate, endDate, selectedKeywords, setSelectedKeywords, keywords, loading, error }) => {
    const filteredKeywords = keywords; // 필터링 로직은 필요에 따라 추가

    const handleSort = (key) => {
        // 정렬 로직
    };

    const handleCheckboxChange = (keyword) => {
        setSelectedKeywords((prev) =>
            prev.includes(keyword)
                ? prev.filter((item) => item !== keyword)
                : [...prev, keyword]
        );
    };

    if (loading) return <div>Loading...</div>; // 로딩 상태 표시
    if (error) return <div>{error}</div>; // 에러 상태 표시

    return (
        <div className="keyword-component">
            <table>
                <thead>
                    <tr>
                        <SortableHeader label="키워드" sortKey="keyKeyword" onSort={handleSort} />
                        <SortableHeader label="노출" sortKey="keyImpressions" onSort={handleSort} />
                        <SortableHeader label="클릭" sortKey="keyClicks" onSort={handleSort} />
                        <SortableHeader label="클릭률" sortKey="keyClickRate" onSort={handleSort} />
                        <SortableHeader label="주문" sortKey="keyTotalSales" onSort={handleSort} />
                        <SortableHeader label="전환율" sortKey="keyCvr" onSort={handleSort} />
                        <SortableHeader label="CPC" sortKey="keyCpc" onSort={handleSort} />
                        <SortableHeader label="광고비" sortKey="keyAdcost" onSort={handleSort} />
                        <SortableHeader label="광고매출" sortKey="keyAdsales" onSort={handleSort} />
                        <SortableHeader label="ROAS" sortKey="keyRoas" onSort={handleSort} />
                        <th>
                            <input
                                type="checkbox"
                                checked={selectedKeywords.length === filteredKeywords.length}
                                onChange={() => setSelectedKeywords(keywords.map(item => item.keyKeyword))}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredKeywords.map((item, index) => (
                        <tr key={index}>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyKeyword}</td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyImpressions}</td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyClicks}</td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyClickRate}%</td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyTotalSales}</td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyCvr}%</td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyCpc}</td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyAdcost}</td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyAdsales}</td>
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>{item.keyRoas}%</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedKeywords.includes(item.keyKeyword)}
                                    onChange={() => handleCheckboxChange(item.keyKeyword)}
                                    disabled={item.keyExcludeFlag} // keyExcludeFlag가 true일 경우 체크박스 비활성화
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
