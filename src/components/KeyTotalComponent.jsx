import React, { useState, useEffect } from "react";
import "../styles/KeyTotal.css";
import KeywordComponent from "./KeywordComponent";
import ExclusionKeywordComponent from "./ExclusionKeywordComponent";
import KeywordBidComponent from "./KeywordBidComponent";
import {
    getKeywords, registerExclusionKeywords, registerKeywordBid,
    getBidKeywords, updateBidKeyword, deleteBodKeywords,
    getExclusionKeywords, removeExclsuionKeywords
} from '../services/keyword'; // API 요청 함수 임포트

const KeytotalComponent = ({ campaignId, startDate, endDate }) => {
    const [activeComponent, setActiveComponent] = useState("keyword");
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [bidKeywords, setBidKeywords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [exclusionKeywords, setExclusionKeywords] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [keyKeyword, setKeyKeyword] = useState(""); // 추가된 상태
    const [activeButton, setActiveButton] = useState("keyword"); // 클릭된 버튼 상태

    // 키워드 조회
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
            setKeywords(response.data || []);
            setError(null);
        } catch (error) {
            setError("키워드를 가져오는 데 실패했습니다.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 입찰 키워드 조회
    const fetchBidKeywords = async () => {
        setLoading(true);
        try {
            const response = await getBidKeywords({ start: startDate, end: endDate, campaignId }); // 입찰 키워드 API 호출
            setBidKeywords(response.data || []); // API 응답에서 입찰 키워드 데이터 설정
            setError(null);
        } catch (error) {
            setError("입찰 키워드를 가져오는 데 실패했습니다.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeywords(); // activeComponent 변경 시 키워드 다시 가져오기
    }, [campaignId, startDate, endDate, activeComponent]); // activeComponent 추가

    useEffect(() => {
        if (activeComponent === "bid") {
            fetchBidKeywords(); // KeywordBidComponent가 활성화될 때 입찰 키워드 조회
        }
    }, [activeComponent]);

    useEffect(() => {
        if (activeComponent === "exclusion") {
            fetchExclusionKeywords();
        }
    }, [activeComponent, campaignId]); // campaignId 추가

    const handleShowKeywords = () => {
        setActiveComponent("keyword");
        setActiveButton("keyword"); // 클릭된 버튼 상태 업데이트
    };

    const handleExclusionKeywords = () => {
        setActiveComponent("exclusion");
        setActiveButton("exclusion"); // 클릭된 버튼 상태 업데이트
    };

    const handleKeywordBids = () => {
        setActiveComponent("bid");
        setActiveButton("bid"); // 클릭된 버튼 상태 업데이트
    };
    // 제외 키워드 등록
    const handleRegisterExclusionKeywords = async () => {
        if (selectedKeywords.length === 0) {
            alert("등록할 제외 키워드를 선택해주세요.");
            return;
        }
        try {
            // console.log(selectedKeywords);
            const response = await registerExclusionKeywords({ selectedKeywords, campaignId });
            const count = response.data.responseData;
            if (count == 0) {
                alert('이미 등록되어 있는 제외키워드입니다.')
            } else {
                alert(`${count}개의 제외 키워드가 성공적으로 등록되었습니다.`);
            }
            setSelectedKeywords([]);
            await fetchKeywords();
        } catch (error) {
            console.error(error);
        }
    };

    // 제외 키워드 조회
    const fetchExclusionKeywords = async () => {
        setLoading(true);
        try {
            const response = await getExclusionKeywords({ campaignId });
            // console.log(response.data);
            setExclusionKeywords(response.data || []);
            setError(null);
        } catch (error) {
            setError("제외 키워드를 가져오는 데 실패했습니다.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 제외 키워드 삭제
    const handleRemoveKeyword = async () => {
        if (selectedKeywords.length === 0) {
            alert("제거할 제외 키워드를 선택해주세요.");
            return;
        }
        try {
            await removeExclsuionKeywords({ selectedKeywords, campaignId });
            const count = selectedKeywords.length;
            alert(`${count}개의 제외 키워드가 성공적으로 삭제되었습니다.`);
            setSelectedKeywords([]);
            setIsAllSelected(false);
            await fetchExclusionKeywords(); // 키워드 새로 고침
        } catch (error) {
            setError("제외 키워드 삭제에 실패했습니다.");
            console.error(error);
        }
    };

    // 입찰가 등록
    const handleRegisterKeywordBids = async () => {
        if (selectedKeywords.length === 0) {
            alert("등록할 키워드를 선택해주세요.");
            return;
        }
        try {
            // console.log(selectedKeywords);
            const response = await registerKeywordBid({ selectedKeywords, campaignId });
            // console.log(response.data.responseNumber);
            const count = response.data.responseNumber;
            if (count == 0) {
                alert(`이미 등록되어 있는 키워드입니다.`);
            } else {
                alert(`${count}개의 수동 입찰가 등록을 완료했습니다.`);
            }
            setSelectedKeywords([]);
            await fetchKeywords();
        } catch (error) {
            console.error(error);
        }
    };
    // 입찰가 수정
    const handleUpdateKeywordBids = async () => {
        if (selectedKeywords.length === 0) {
            alert("입찰가를 수정 할 키워드를 선택해주세요.");
            return;
        }
        try {
            console.log(selectedKeywords);
            await updateBidKeyword({ selectedKeywords, campaignId });
            const count = selectedKeywords.length;
            alert(`${count}개의 수동 입찰가 변경을 완료했습니다.`);
            setSelectedKeywords([]);
            await fetchKeywords();
        } catch (error) {
            console.error(error);
        }
    };
    //입찰가 삭제
    const handleDeleteKeywordBids = async () => {
        if (selectedKeywords.length === 0) {
            alert("입찰가를 삭제 할 키워드를 선택해주세요.");
            return;
        }
        try {
            console.log(selectedKeywords);
            await deleteBodKeywords({ selectedKeywords, campaignId });
            const count = selectedKeywords.length;
            alert(`${count}개의 수동 입찰가 삭제를 완료했습니다.`);
            setSelectedKeywords([]);
            await fetchBidKeywords();
        } catch (error) {
            console.error(error);
        }
    }

    const handleDownload = () => {
        if (exclusionKeywords.length === 0) {
            alert("복사할 제외 키드가 없습니다.");
            return;
        }
        // console.log(exclusionKeywords);
        const keywordsToCopy = exclusionKeywords.map(keyword => keyword.exclusionKeyword).join('\n'); // 제외 키워드의 값을 줄바꿈으로 연결
        navigator.clipboard.writeText(keywordsToCopy) // 클립보드에 복사
            .then(() => {
                alert("제외 키워드가 클립보드에 복사되었습니다.");
            })
            .catch((error) => {
                console.error("복사 실패:", error);
            });
    };

    const handleDownloadBid = () => {
        if (bidKeywords.length === 0) {
            alert("복사할 입찰가 없습니다.");
            return;
        }
        // console.log(exclusionKeywords);
        const keywordsToCopy = bidKeywords.map(keyword => `${keyword.keyKeyword}\t${keyword.bid}`).join('\n'); // 제외 키워드와 가격을 탭으로 구분하여 같은 가로줄로 연결
        navigator.clipboard.writeText(keywordsToCopy) // 클립보드에 복사
            .then(() => {
                alert("입찰가가가 클립보드에 복사되었습니다.");
            })
            .catch((error) => {
                console.error("복사 실패:", error);
            });
    };

    return (
        <div className="keyword-component">
            <div className="button-container">
                <button
                    className={`keyword-button ${activeButton === "keyword" ? "active" : ""}`}
                    onClick={handleShowKeywords}
                >
                    전체키워드
                </button>
                <button
                    className={`keyword-button ${activeButton === "exclusion" ? "active" : ""}`}
                    onClick={handleExclusionKeywords}
                >
                    제외키워드
                </button>
                <button
                    className={`keyword-button ${activeButton === "bid" ? "active" : ""}`}
                    onClick={handleKeywordBids}
                >
                    수동입찰가
                </button>
                <input
                    type="text"
                    placeholder="키워드를 입력하세요"
                    className="keyword-input"
                    value={keyKeyword}
                    onChange={(e) => setKeyKeyword(e.target.value)} // 입력 시 키워드 업데이트
                />
                <div className="keyword-buttion2">
                    {activeComponent === "keyword" && (
                        <>
                            <button className="keyword-button primary-button" onClick={handleRegisterExclusionKeywords}>제외 키워드 등록</button>
                            <button className="keyword-button primary-button" onClick={handleRegisterKeywordBids}>입찰가 등록</button>
                        </>
                    )}
                    {activeComponent === "exclusion" && (
                        <>
                            <button className="keyword-button primary-button" onClick={handleDownload}>복사</button>
                            <button className="keyword-button primary-button" onClick={handleRemoveKeyword}>삭제</button>
                        </>
                    )}
                    {activeComponent === "bid" && (
                        <>
                            <button className="keyword-button primary-button" onClick={handleUpdateKeywordBids}>수정</button>
                            <button className="keyword-button primary-button" onClick={handleDownloadBid}>복사</button>
                            <button className="keyword-button primary-button" onClick={handleDeleteKeywordBids}>삭제</button>
                        </>
                    )}
                </div>
            </div>
            {activeComponent === "keyword" && (
                <KeywordComponent
                    campaignId={campaignId}
                    startDate={startDate}
                    endDate={endDate}
                    selectedKeywords={selectedKeywords}
                    setSelectedKeywords={setSelectedKeywords}
                    keywords={keywords.filter(item => item.keyKeyword.includes(keyKeyword))} // 객체의 keyword 프로퍼티로 필터링                    loading={loading}
                    error={error}
                />
            )}
            {activeComponent === "exclusion" && (
                <ExclusionKeywordComponent
                    keywords={exclusionKeywords.filter(item => item.exclusionKeyword.includes(keyKeyword))}
                    selectedKeywords={selectedKeywords}
                    setSelectedKeywords={setSelectedKeywords}
                    isAllSelected={isAllSelected}
                    setIsAllSelected={setIsAllSelected}
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                    loading={loading}
                    error={error}
                />
            )}
            {activeComponent === "bid" && (
                <KeywordBidComponent
                    campaignId={campaignId}
                    startDate={startDate}
                    endDate={endDate}
                    selectedKeywords={selectedKeywords}
                    setSelectedKeywords={setSelectedKeywords}
                    keywords={bidKeywords.filter(item => item.keyKeyword.includes(keyKeyword))} // 변경: 입찰 키워드 전달
                    loading={loading}
                    error={error}
                />
            )}
        </div>
    );
};

export default KeytotalComponent

