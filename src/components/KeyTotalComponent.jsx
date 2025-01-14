import React, { useState, useEffect } from "react";
import "../styles/KeyTotal.css";
import KeywordComponent from "./KeywordComponent";
import ExclusionKeywordComponent from "./ExclusionKeywordComponent";
import { getKeywords, registerExclusionKeywords } from '../services/keyword'; // API 요청 함수 임포트

const KeytotalComponent = ({ campaignId, startDate, endDate }) => {
    const [activeComponent, setActiveComponent] = useState(null); // 어떤 컴포넌트를 보여줄지 상태 관리
    const [selectedKeywords, setSelectedKeywords] = useState([]); // 선택된 키워드 상태
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
        fetchKeywords(); // 컴포넌트 마운트 시 키워드 가져오기
    }, [campaignId, startDate, endDate]);

    const handleShowKeywords = () => {
        setActiveComponent("keyword"); // KeywordComponent 표시
    };

    const handleExclusionKeywords = () => {
        setActiveComponent("exclusion"); // ExclusionKeywordComponent 표시
    };

    const handleRegisterExclusionKeywords = async () => {
        if (selectedKeywords.length === 0) {
            alert("등록할 제외 키워드를 선택해주세요.");
            return;
        }

        try {
            console.log(selectedKeywords);
            // API 요청
            await registerExclusionKeywords({ selectedKeywords, campaignId });
            const count = selectedKeywords.length;
            alert(`${count}개의 제외 키워드가 성공적으로 등록되었습니다.`);
            setSelectedKeywords([]); // 등록 후 선택 초기화
            await fetchKeywords(); // 키워드 다시 가져오기
        } catch (error) {
            console.error(error);
        }
    };

    const handleDownload = () => {
        handleRegisterExclusionKeywords(); // 다운로드 핸들러에서 제외 키워드 등록 호출
    };

    return (
        <div className="keyword-component">
            <div className="button-container">
                <button className="keyword-button" onClick={handleShowKeywords}>전체키워드</button>
                <button className="keyword-button" onClick={handleExclusionKeywords}>제외키워드</button>
                <button className="keyword-button primary-button">수동입력가</button>
                <input type="text" placeholder="키워드를 입력하세요" className="keyword-input" />
                {activeComponent === "keyword" && (
                    <>
                        <button className="keyword-button primary-button" onClick={handleDownload}>제외 키워드 등록</button>
                        <button className="keyword-button primary-button" onClick={handleDownload}>입찰가 등록</button>
                    </>

                )}
                {activeComponent === "exclusion" && (
                    <>
                        <button className="keyword-button primary-button" onClick={handleDownload}>복사</button>
                        <button className="keyword-button primary-button" onClick={handleDownload}>삭제</button>
                    </>

                )}
            </div>
            {activeComponent === "keyword" && (
                <KeywordComponent
                    campaignId={campaignId}
                    startDate={startDate}
                    endDate={endDate}
                    selectedKeywords={selectedKeywords} // 선택된 키워드를 props로 전달
                    setSelectedKeywords={setSelectedKeywords} // 키워드 선택을 위한 상태 업데이트 함수 전달
                    keywords={keywords} // 키워드 데이터 전달
                    loading={loading} // 로딩 상태 전달
                    error={error} // 에러 상태 전달
                />
            )}
            {activeComponent === "exclusion" && (
                <ExclusionKeywordComponent
                    campaignId={campaignId}
                />
            )}
        </div>
    );
};

export default KeytotalComponent;

