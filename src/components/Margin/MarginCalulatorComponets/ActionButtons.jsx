import React, { useState, useEffect } from "react";
import "../../../styles/MarginCalculatorForm.css"; // CSS 연결
import { updateExecutionAboutCampaign } from "../../../services/marginforcampaign";

const ActionButtons = ({ selectedOptions, options, campaignId, handleCalculate }) => {
    const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가

    // 모든 필드가 채워져 있는지 확인하는 함수
    const isAllFieldsFilled = () => {
        return selectedOptions.every(index => {
            const option = options[index];
            return option && // 인덱스가 유효한지 체크
                option.mfcProductName &&
                option.mfcSalePrice !== undefined &&
                option.mfcTotalPrice !== undefined &&
                option.mfcCostPrice !== undefined;
        });
    };

    const areMarginsAndRoasFilled = () => {
        return selectedOptions.every(index => {
            const option = options[index];
            return option && // 인덱스가 유효한지 체크
                option.mfcPerPiece !== "" &&
                option.mfcZeroRoas !== "";
        });
    };
    // 저장하기
    const handleSave = async () => {
        if (selectedOptions.length === 0) {
            alert("옵션을 선택해주세요.");
            return;
        }

        // 비어 있는 필드가 있는지 확인
        const invalidOptions = selectedOptions.filter(index => {
            const option = options[index];
            return !option ||
                !option.mfcProductName ||
                option.mfcSalePrice === undefined || option.mfcSalePrice === "" ||
                option.mfcTotalPrice === undefined || option.mfcTotalPrice === "" ||
                option.mfcCostPrice === undefined || option.mfcCostPrice === "";
        });

        // 저장 전 제로ROAS, 개별마진 체크
        if (!areMarginsAndRoasFilled()) {
            alert("마진과 제로 ROAS를 계산하기 위해 '계산하기' 버튼을 눌러주세요.");
            return;
        }

        // 빈 값 있을때 빨강색 메세지
        if (invalidOptions.length > 0) {
            setErrorMessage("데이터를 다 채워주세요.");
            return;
        }

        // 마진과 제로 ROAS 계산 후 업데이트
        const updatedOptions = [...options]; // 원본 옵션 복사
        // 수정 하는경우, 앞에 3개 수정 후 계산하기 안 누르고 저장시, 바뀐 값으로 저장
        selectedOptions.forEach(index => {
            const option = updatedOptions[index];
            if (option.mfcSalePrice && option.mfcTotalPrice && option.mfcCostPrice) {
                const margin = option.mfcSalePrice - 1.1 * option.mfcTotalPrice - option.mfcCostPrice || 0;
                const zeroROAS = margin !== 0 ? ((option.mfcSalePrice / margin) * 1.1 * 100).toFixed(2) : "0.00";

                // 마진과 제로 ROAS 업데이트
                option.mfcPerPiece = margin;
                option.mfcZeroRoas = parseFloat(zeroROAS);
            }
        });
        // 선택된 옵션만 포함하도록 수정
        const mfcRequestDtos = {
            campaignId: campaignId,
            data: selectedOptions.map(index => ({
                mfcId: updatedOptions[index].id,
                mfcProductName: updatedOptions[index].mfcProductName,
                mfcSalePrice: updatedOptions[index].mfcSalePrice,
                mfcTotalPrice: updatedOptions[index].mfcTotalPrice,
                mfcCostPrice: updatedOptions[index].mfcCostPrice,
                mfcPerPiece: updatedOptions[index].mfcPerPiece,
                mfcZeroRoas: updatedOptions[index].mfcZeroRoas,
            })),
        };
        // API 호출을 통한 업데이트
        try {
            const response = await updateExecutionAboutCampaign(mfcRequestDtos);
            console.log("Save response:", response);

            if (response.data && response.data.failedProductNames && response.data.failedProductNames.length > 0) {
                alert(`저장 실패한 상품명: ${response.data.failedProductNames.join(", ")}`);
            } else {
                alert("저장이 성공적으로 완료되었습니다.");
                setErrorMessage(""); // 성공 시 에러 메시지 초기화
            }
        } catch (error) {
            console.error("Error saving data:", error);
            alert("저장하는 중 오류가 발생했습니다.");
        }
    };


    const handleCalculateClick = () => {
        if (selectedOptions.length === 0) {
            alert("옵션을 선택해주세요.");
            return;
        }

        handleCalculate();
    };

    // 에러 메시지 자동 사라지게 하기
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(""); // 메시지 초기화
            }, 3000); // 3초 후에 메시지 사라짐

            return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
        }
    }, [errorMessage]);

    return (
        <div className="action-buttons">
            <button className="calculate" onClick={handleCalculateClick}>계산하기</button>
            <button
                className="save"
                onClick={handleSave}
                disabled={!isAllFieldsFilled()} // 비활성화 조건 추가
                style={{
                    backgroundColor: isAllFieldsFilled() ? '#28a575' : 'gray', // 버튼 색상 변경
                    color: 'white',
                    cursor: isAllFieldsFilled() ? 'pointer' : 'not-allowed',
                }}
            >
                저장
            </button>
            {errorMessage && (
                <div style={{
                    color: 'red',
                    fontSize: '12px',
                    marginTop: '5px',
                    marginBottom: '10px', // 아래쪽 여백 추가
                    position: 'relative', // position을 relative로 설정
                    background: 'rgba(255, 0, 0, 0.1)',
                    border: '1px solid red',
                    padding: '5px',
                    borderRadius: '5px',
                }}>
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default ActionButtons;
