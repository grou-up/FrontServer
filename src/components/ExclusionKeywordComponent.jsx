import React, { useState, useEffect } from "react";
import "../styles/KeywordComponent.css"; // 스타일 파일
import { ArrowDownUp } from 'lucide-react';
import { getExclusionKeywords } from '../services/keyword'; // API 요청 함수 임포트

const ExclusionKeywordComponent = ({ campaignId }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false); // 전체 선택 상태
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // 정렬 상태
    const [keywords, setKeywords] = useState([]); // 키워드 데이터 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    useEffect(() => {
        const fetchExclusionKeywords = async () => {
            setLoading(true);
            try {
                const response = await getExclusionKeywords({campaignId });
                setKeywords(response.data || []); // API 응답에서 키워드 데이터 설정
            } catch (error) {
                setError("제외 키워드를 가져오는 데 실패했습니다.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchExclusionKeywords();
    }, [campaignId]); // campaignId가 변경될 때마다 호출

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
                    <button className="action-button">제외 키워드 삭제</button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort("keyKeyword")}>
                            키워드
                            <ArrowDownUp />
                        </th>
                        <th onClick={() => handleSort("keyImpressions")}>
                            노출
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
                            <td>{item.keyKeyword}</td>
                            <td>{item.keyImpressions}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedKeywords.includes(item.keyKeyword)}
                                    onChange={() => handleCheckboxChange(item.keyKeyword)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExclusionKeywordComponent;