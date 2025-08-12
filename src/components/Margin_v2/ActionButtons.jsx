import React, { useState, useEffect } from "react";
import "../../styles/MarginCalculatorForm.css"; // CSS 연결

const ActionButtons = ({ selectedOptions, options, handleSave, handleDelete }) => {
    const [errorMessage, setErrorMessage] = useState("");

    // 저장 가능한 상태인지 확인하는 함수
    const isSaveEnabled = () => {
        if (selectedOptions.length === 0) return false;

        // ✅ selectedOptions는 이제 실제 옵션 객체들의 배열임
        return selectedOptions.every(option => {
            return option &&
                option.campaignId &&
                option.mfcProductName &&
                option.mfcType &&
                option.mfcSalePrice &&
                option.mfcCostPrice &&
                option.mfcTotalPrice;
        });
    };

    const onSaveClick = () => {
        if (!isSaveEnabled()) {
            setErrorMessage("필수 항목(캠페인, 상품명, 유형, 판매가, 원가, 총비용)을 모두 채워주세요.");
            return;
        }
        setErrorMessage(""); // 에러 메시지 초기화
        handleSave(); // 부모의 저장 함수 호출
    };

    const onDeleteClick = () => {
        if (selectedOptions.length === 0) {
            alert("삭제할 항목을 선택해주세요.");
            return;
        }
        handleDelete(); // 부모의 삭제 함수 호출
    };

    // 3초 후 에러 메시지 자동 삭제
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    return (
        <div className="action-button-group">
            <button
                className="save-button"
                onClick={onSaveClick}
                disabled={!isSaveEnabled()}
                style={{
                    opacity: isSaveEnabled() ? 1 : 0.6,
                    cursor: isSaveEnabled() ? 'pointer' : 'not-allowed'
                }}
            >
                저장 ({selectedOptions.length})
            </button>
            <button
                className="delete-button"
                onClick={onDeleteClick}
                disabled={selectedOptions.length === 0}
                style={{
                    opacity: selectedOptions.length > 0 ? 1 : 0.6,
                    cursor: selectedOptions.length > 0 ? 'pointer' : 'not-allowed'
                }}
            >
                삭제 ({selectedOptions.length})
            </button>
            {errorMessage && (
                <div className="error-message-box">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default ActionButtons;