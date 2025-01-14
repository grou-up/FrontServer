import React, { useState, useEffect } from "react";
import "../styles/KeywordComponent.css"; // 스타일 파일
import { ArrowDownUp } from 'lucide-react';
import { getExclusionKeywords, removeExclsuionKeywords } from '../services/keyword'; // API 요청 함수 임포트

const ExclusionKeywordComponent = ({ campaignId }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false); // 전체 선택 상태
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // 정렬 상태
    const [keywords, setKeywords] = useState([]); // 키워드 데이터 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const [successMessage, setSuccessMessage] = useState(""); // 성공 메시지 상태

    // 키워드 가져오기 함수 정의
    const fetchExclusionKeywords = async () => {
        setLoading(true);
        try {
            const response = await getExclusionKeywords({ campaignId });
            setKeywords(response.data || []); // API 응답에서 키워드 데이터 설정
            setError(null); // 에러 초기화
        } catch (error) {
            setError("제외 키워드를 가져오는 데 실패했습니다.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExclusionKeywords(); // 컴포넌트 마운트 시 키워드 가져오기
    }, [campaignId]); // campaignId가 변경될 때마다 호출

    const filteredKeywords = keywords
        .filter((item) => item.exclusionKeyword.includes(searchTerm)) // keyKeyword가 문자열로 변경됨
        .sort((a, b) => {
            if (!sortConfig.key) return 0; // 정렬 키가 없으면 정렬하지 않음
            const order = sortConfig.direction === "asc" ? 1 : -1;
            return a > b ? order : a < b ? -order : 0; // 문자열 비교
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
            // filteredKeywords에서 exclusionKeyword만 추출하여 선택
            setSelectedKeywords(filteredKeywords.map((item) => item.exclusionKeyword));
        }
        setIsAllSelected(!isAllSelected);
    };

    const handleCopy = () => {
        const keywordsToCopy = selectedKeywords.join("\n");
        navigator.clipboard.writeText(keywordsToCopy).then(() => {
            alert("복사 완료: " + keywordsToCopy);
        });
    };

    const removeKeyword = async () => {
        if (selectedKeywords.length === 0) {
            alert("제거할 제외 키워드를 선택해주세요.");
            return;
        }
        try {
            console.log(selectedKeywords);
            // API 요청
            await removeExclsuionKeywords({ selectedKeywords, campaignId });
            setSuccessMessage("성공적으로 제외 키워드를 삭제했습니다."); // 성공 메시지 설정
            setSelectedKeywords([]); // 선택 초기화
            setIsAllSelected(false); // 전체 선택 상태 초기화
            // 키워드를 다시 가져와서 자동 새로 고침
            await fetchExclusionKeywords(); // 추가된 부분
        } catch (error) {
            setError("제외 키워드 삭제에 실패했습니다.");
            console.error(error);
        }
    };

    if (loading) return <div>Loading...</div>; // 로딩 상태 표시
    if (error) return <div>{error}</div>; // 에러 상태 표시

    return (
        <div className="keyword-component">
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort("keyKeyword")}>
                            제외 키워드
                            <ArrowDownUp />
                        </th>
                        <th onClick={() => handleSort("keyImpressions")}>
                            등록 날짜
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
                    {filteredKeywords.map((keyword, index) => (
                        <tr key={index}>
                            <td>{keyword.exclusionKeyword}</td>
                            <td>{keyword.addTime}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedKeywords.includes(keyword.exclusionKeyword)}
                                    onChange={() => handleCheckboxChange(keyword.exclusionKeyword)}
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
