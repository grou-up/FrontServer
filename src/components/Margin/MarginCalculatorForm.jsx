import React, { useState } from "react";
import OptionsTable from "./MarginCalulatorComponets/OptionsTable";
import { getExecutionAboutCampaign, deleteExecutionAboutCampaign } from "../../services/marginforcampaign";
import ActionButtons from "./MarginCalulatorComponets/ActionButtons";
import "../../styles/MarginCalculatorForm.css";

const MarginCalculatorForm = ({ campaigns }) => {
    const [expandedCampaignId, setExpandedCampaignId] = useState(null); // 확장된 캠페인 ID
    const [calculatedOptions, setCalculatedOptions] = useState([]); // 옵션 데이터
    const [selectedOptions, setSelectedOptions] = useState([]); // 선택된 옵션 상태

    const allSelected = calculatedOptions.length > 0 && selectedOptions.length === calculatedOptions.length;

    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedOptions([]); // 모든 선택 해제
        } else {
            setSelectedOptions(calculatedOptions.map((_, index) => index)); // 모든 선택
        }
    };

    const fetchOptionsForCampaign = async (campaignId) => {
        try {
            const response = await getExecutionAboutCampaign({ campaignId });
            const optionsWithDefaults = (response.data || []).map(option => ({
                id: option.id,
                mfcProductName: option.mfcProductName,
                mfcSalePrice: option.mfcSalePrice || 0,
                mfcTotalPrice: option.mfcTotalPrice || 0,
                mfcCostPrice: option.mfcCostPrice || 0,
                mfcPerPiece: option.mfcPerPiece || 0,
                mfcZeroRoas: option.mfcZeroRoas || 0,
                // 다른 속성도 필요에 따라 초기화
            }));
            setCalculatedOptions(optionsWithDefaults);
        } catch (error) {
            console.error("옵션 데이터를 가져오는 중 오류 발생:", error);
        }
    };

    const toggleExpandCampaign = (campaignId) => {
        if (expandedCampaignId === campaignId) {
            setExpandedCampaignId(null);
        } else {
            setExpandedCampaignId(campaignId);
            fetchOptionsForCampaign(campaignId);
        }
    };

    const addEmptyRow = (campaignId) => {
        if (expandedCampaignId !== campaignId) {
            toggleExpandCampaign(campaignId);
        }
        setCalculatedOptions(prevOptions => [
            ...prevOptions,
            { mfcProductName: "", mfcTotalPrice: "", mfcCostPrice: "", mfcPerPiece: "", mfcZeroRoas: "" }
        ]);
    };

    const handleInputChange = (index, field, value) => {
        const updatedOptions = [...calculatedOptions];
        updatedOptions[index] = {
            ...updatedOptions[index],
            [field]: value,
        };
        setCalculatedOptions(updatedOptions);
    };

    const handleCheckboxChange = (index) => {
        setSelectedOptions(prev => {
            const newSelectedOptions = [...prev];
            if (newSelectedOptions.includes(index)) {
                newSelectedOptions.splice(newSelectedOptions.indexOf(index), 1);
            } else {
                newSelectedOptions.push(index);
            }
            return newSelectedOptions;
        });
    };

    const handleCalculate = () => {
        console.log("버튼 클릭됨");
        const updatedOptions = [...calculatedOptions];

        selectedOptions.forEach(index => {
            if (index < 0 || index >= updatedOptions.length) {
                console.warn(`Invalid index: ${index}`);
                return; // 유효하지 않은 인덱스는 무시
            }

            const option = updatedOptions[index];
            console.log(option);

            // 필요한 값이 존재하는지 확인
            if (option && option.mfcSalePrice && option.mfcTotalPrice && option.mfcCostPrice) {
                const margin = Math.round(option.mfcSalePrice - (1.1 * option.mfcTotalPrice) - option.mfcCostPrice) || 0;
                const zeroROAS = margin !== 0 ? ((option.mfcSalePrice / margin) * 1.1 * 100).toFixed(2) : "0.00";
                console.log(margin, zeroROAS);

                updatedOptions[index] = {
                    ...option,
                    mfcPerPiece: margin,
                    mfcZeroRoas: parseFloat(zeroROAS), // 문자열로 변환된 값을 다시 숫자로 변환
                };
            } else {
                console.warn(`Missing data for option at index ${index}:`, option);
            }
        });

        setCalculatedOptions(updatedOptions);
    };

    const handleDeleteOption = async (indexToDelete) => {
        const optionToDelete = calculatedOptions[indexToDelete];
        const id = optionToDelete.id; // 삭제할 ID (옵션 객체에 ID가 있다고 가정)

        // 삭제 확인
        const confirmDelete = window.confirm("삭제하시겠습니까?");
        if (!confirmDelete) {
            return; // 사용자가 "아니오"를 선택하면 함수를 종료
        }

        try {
            await deleteExecutionAboutCampaign({ id }); // API 호출
            setCalculatedOptions(prevOptions =>
                prevOptions.filter((_, index) => index !== indexToDelete)
            );
            setSelectedOptions(prevSelected =>
                prevSelected.filter(selectedIndex => selectedIndex !== indexToDelete)
            );
        } catch (error) {
            alert("삭제 실패");
            // 오류 처리 로직 추가 가능 (예: 사용자에게 알림)
        }
    };

    return (
        <div className="campaign-list">
            {campaigns.map((campaign) => (
                <div
                    key={campaign.campaignId}
                    className={`campaign-card ${expandedCampaignId === campaign.campaignId ? "expanded" : ""}`}
                >
                    <div
                        className="campaign-header"
                        onClick={() => toggleExpandCampaign(campaign.campaignId)}
                    >
                        <h3>{campaign.title}</h3>
                        <button
                            className="add-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                addEmptyRow(campaign.campaignId);
                            }}
                        >
                            마진입력
                        </button>
                    </div>
                    {expandedCampaignId === campaign.campaignId && (
                        <div className="campaign-details">
                            <OptionsTable
                                options={calculatedOptions}
                                handleInputChange={handleInputChange}
                                handleCheckboxChange={handleCheckboxChange}
                                selectedOptions={selectedOptions}
                                handleDeleteOption={handleDeleteOption} // 삭제 핸들러 전달
                                handleSelectAll={handleSelectAll} // 전체 선택 핸들러 전달
                                allSelected={allSelected} // 전체 선택 상태 전달
                            />
                            <ActionButtons
                                selectedOptions={selectedOptions}
                                options={calculatedOptions}
                                campaignId={campaign.campaignId}
                                handleCalculate={handleCalculate} // 계산하기 핸들러 전달
                                handleDeleteOption={handleDeleteOption} // 삭제 핸들러 전달
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MarginCalculatorForm;
