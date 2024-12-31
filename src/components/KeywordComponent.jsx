import React, { useState, useEffect } from "react";
import "../styles/KeywordComponent.css"; // 스타일 파일
import { getKeywords, registerExclusionKeywords } from '../services/keyword'; // API 요청 함수 임포트
import { getCampaignDetails } from "../services/capaigndetails";
import "../styles/Table.css";
import SortableHeader from '../components/SortableHeader';

const KeywordComponent = ({ campaignId, startDate, endDate }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false); // 전체 선택 상태
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // 정렬 상태
    const [keywords, setKeywords] = useState([]); // 키워드 데이터 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    const fetchKeywords = async () => {
        if (!startDate || !endDate) {
            setError("시작 날짜와 종료 날짜를 설정해주세요.");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await getKeywords({ start: startDate, end: endDate, campaignId });
            console.log(response.data);
            setKeywords(response.data || []); // API 응답에서 키워드 데이터 설정
            setError(null); // 에러 초기화
        } catch (error) {
            setError("키워드를 가져오는 데 실패했습니다.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeywords();
    }, [campaignId, startDate, endDate]);

    const filteredKeywords = keywords
        .filter((item) => item.keyKeyword.includes(searchTerm))
        .sort((a, b) => {
            if (!sortConfig.key) return 0; // 정렬 키가 없으면 정렬하지 않음
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
            setSelectedKeywords(filteredKeywords.map((item) => item.keyKeyword));
        }
        setIsAllSelected(!isAllSelected);
    };

    const handleCopy = () => {
        const keywordsToCopy = selectedKeywords.join("\n");
        navigator.clipboard.writeText(keywordsToCopy).then(() => {
            alert("복사 완료: " + keywordsToCopy);
        });
    };

    const handleRegisterExclusionKeywords = async () => {
        if (selectedKeywords.length === 0) {
            alert("등록할 제외 키워드를 선택해주세요.");
            return;
        }
        
        try {
            console.log(selectedKeywords);
            // API 요청
            await registerExclusionKeywords({ selectedKeywords, campaignId }); // 수정된 부분
            const count = selectedKeywords.length;
            alert(`${count}개의 제외 키워드가 성공적으로 등록되었습니다.`); // 동적으로 개수 표시
            setSelectedKeywords([]); // 등록 후 선택 초기화
            setIsAllSelected(false); // 전체 선택 상태 초기화
            await fetchKeywords();
        } catch (error) {
            setError("제외 키워드 등록에 실패했습니다.");
            console.error(error);
        }
    };

    if (loading) return <div>Loading...</div>; // 로딩 상태 표시
    if (error) return <div>{error}</div>; // 에러 상태 표시

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
                    <button className="action-button" onClick={handleRegisterExclusionKeywords}>
                        제외 키워드 등록
                    </button>
                    <button className="action-button">수동 입력가 관리</button>
                </div>
            </div>
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
                                checked={isAllSelected && selectedKeywords.length === filteredKeywords.length}
                                onChange={handleSelectAll}
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
                            <td style={{ color: item.keyExcludeFlag ? 'red' : 'inherit' }}>
                                {item.keyClickRate}% {/* 클릭률에 % 추가 */}
                            </td>
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
