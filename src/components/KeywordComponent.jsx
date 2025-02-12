import React, { useState } from "react";
import "../styles/KeywordComponent.css"; // 스타일 파일
import SortableHeader from '../components/SortableHeader';
import KeywordOptionModal from './KeywordOptionModal'; // 모달 컴포넌트 임포트
import { getExeNames } from '../services/execution';

const KeywordComponent = ({ campaignId, startDate, endDate, selectedKeywords, setSelectedKeywords, keywords, loading, error }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedKeyword, setSelectedKeyword] = useState(null);
    // const [optionNames, setOptionNames] = useState({}); // 옵션 이름 저장용 상태 추가
    const [sortConfig, setSortConfig] = useState({ key: 'keyKeyword', direction: 'asc' }); // 정렬 상태 추가

    const filteredKeywords = keywords.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleCheckboxChange = (event, item) => {
        event.stopPropagation(); // 이벤트 전파 중지
        const keywordData = {
            keyword: item.keyKeyword,
            bid: item.keyCpc // keyBid를 keyCpc로 설정
        };

        setSelectedKeywords((prev) => {
            if (prev.some((kw) => kw.keyword === keywordData.keyword)) {
                return prev.filter((kw) => kw.keyword !== keywordData.keyword);
            } else {
                return [...prev, keywordData];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedKeywords.length === filteredKeywords.length) {
            // 전체 선택 해제
            setSelectedKeywords([]);
        } else {
            // 전체 선택
            const allKeywords = filteredKeywords.map(item => ({
                keyword: item.keyKeyword,
                bid: item.keyCpc
            }));
            setSelectedKeywords(allKeywords);
        }
    };

    const handleRowClick = async (item) => {
        setSelectedKeyword(item); // 선택된 키워드 설정
        if (item.keyTotalSales == 0) {
            alert("판매 데이터가 없어요!")
        } else {
            setIsModalOpen(true); // 모달 열기
        }
        // API 호출하여 옵션 이름 가져오기
        // try {
        //     const keySalesOptions = item.keySalesOptions || {}; // 기본값으로 빈 객체 설정
        //     const list = Object.keys(keySalesOptions); // 키 목록 가져오기

        //     if (list.length === 0) {
        //         console.warn("keySalesOptions가 비어 있습니다."); // 경고 메시지
        //         return; // 더 이상 진행하지 않음
        //     }

        //     const formattedList = list.join(','); // 목록을 ','로 연결된 문자열로 변환

        //     // API 호출 예시
        //     const data = await getExeNames({ campaignId, keySalesOptions: formattedList }); // campaignId와 keySalesOptions 사용
        //     // console.log(data);
        //     setOptionNames(keySalesOptions); // API 응답으로 받은 옵션 이름 설정
        // } catch (error) {
        //     console.error("옵션 이름을 가져오는 데 실패했습니다:", error);
        //     // 에러 처리 로직 추가 가능
        // }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedKeyword(null);
        // setOptionNames({}); // 모달 닫을 때 옵션 이름 초기화
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
                        <SortableHeader label="CPC" sortKey="keyCpc" onSort={handleSort} />
                        <SortableHeader label="광고비" sortKey="keyAdcost" onSort={handleSort} />
                        <SortableHeader label="광고매출" sortKey="keyAdsales" onSort={handleSort} />
                        <SortableHeader label="ROAS" sortKey="keyRoas" onSort={handleSort} />
                        <th>
                            <input
                                type="checkbox"
                                checked={selectedKeywords.length === filteredKeywords.length}
                                onChange={handleSelectAll} // 전체 선택/해제 로직
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredKeywords.map((item, index) => (
                        <tr key={index} onClick={() => handleRowClick(item)}>
                            <td style={{
                                color: item.keyExcludeFlag ? '#d3264f' : 'inherit',
                                fontWeight: item.keyTotalSales > 1 ? 'bold' : 'normal' // 조건부 bold 적용
                            }}>
                                {item.keyKeyword}
                                {item.keyBidFlag && <span className="badge">Bid</span>}
                            </td>
                            <td style={{
                                color: item.keyExcludeFlag ? '#d3264f' : 'inherit',
                            }}>
                                {item.keyImpressions.toLocaleString()} {/* 천 단위 구분 기호 추가 */}
                            </td>
                            <td style={{
                                color: item.keyExcludeFlag ? '#d3264f' : 'inherit',
                            }}>
                                {item.keyClicks.toLocaleString()} {/* 천 단위 구분 기호 추가 */}
                            </td>
                            <td style={{
                                color: item.keyExcludeFlag ? '#d3264f' : 'inherit',
                            }}>
                                {item.keyClickRate.toLocaleString()}% {/* 천 단위 구분 기호 추가 */}
                            </td>
                            <td style={{
                                color: item.keyExcludeFlag ? '#d3264f' : 'inherit',
                            }}>
                                {item.keyTotalSales.toLocaleString()} {/* 천 단위 구분 기호 추가 */}
                            </td>
                            <td style={{
                                color: item.keyExcludeFlag ? '#d3264f' : 'inherit',
                            }}>
                                {item.keyCvr.toLocaleString()}% {/* 천 단위 구분 기호 추가 */}
                            </td>
                            <td style={{
                                color: item.keyExcludeFlag ? '#d3264f' : 'inherit',
                            }}>
                                {item.keyCpc.toLocaleString()}원 {/* 천 단위 구분 기호 추가 */}
                            </td>
                            <td style={{
                                color: item.keyExcludeFlag ? '#d3264f' : 'inherit',
                            }}>
                                {item.keyAdcost.toLocaleString()}원 {/* 천 단위 구분 기호 추가 */}
                            </td>
                            <td style={{
                                color: item.keyExcludeFlag ? '#d3264f' : 'inherit',
                            }}>
                                {item.keyAdsales.toLocaleString()}원 {/* 천 단위 구분 기호 추가 */}
                            </td>
                            <td style={{
                                color: item.keyExcludeFlag ? '#d3264f' : 'inherit',
                            }}>
                                {item.keyRoas.toLocaleString()}% {/* 천 단위 구분 기호 추가 */}
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedKeywords.some(kw => kw.keyword === item.keyKeyword)}
                                    onChange={(e) => handleCheckboxChange(e, item)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && selectedKeyword && (
                <KeywordOptionModal
                    onClose={closeModal}
                    salesOptions={selectedKeyword.keySalesOptions}
                    // optionNames={optionNames}
                    startDate={startDate}
                    endDate={endDate}
                >
                    {/* <h2>{selectedKeyword.keyKeyword}</h2> keyKeyword만 표시 */}
                </KeywordOptionModal>
            )}
        </div>
    );
};

export default KeywordComponent;
