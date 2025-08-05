import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import OptionsTable from "../Margin/MarginCalulatorComponets/OptionsTable";
import { getExecutionAboutCampaign, deleteExecutionAboutCampaign } from "../../services/marginforcampaign";
import ActionButtons from "../Margin/MarginCalulatorComponets/ActionButtons";
import "../../styles/MarginCalculatorForm.css";

const MarginCalculatorForm = ({ campaigns, onCampaignOrderChange }) => {
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
                mfcType: option.mfcType || "",
                mfcReturnPrice: option.mfcReturnPrice || 0,
                mfcPerPiece: option.mfcPerPiece || 0,
                mfcZeroRoas: option.mfcZeroRoas || 0,
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
        const updatedOptions = [...calculatedOptions];

        selectedOptions.forEach(index => {
            if (index < 0 || index >= updatedOptions.length) {
                console.warn(`Invalid index: ${index}`);
                return; // 유효하지 않은 인덱스는 무시
            }

            const option = updatedOptions[index];

            if (option && option.mfcSalePrice && option.mfcTotalPrice && option.mfcCostPrice) {
                const margin = Math.round(option.mfcSalePrice - (1.1 * option.mfcTotalPrice) - option.mfcCostPrice) || 0;
                const zeroROAS = margin !== 0 ? ((option.mfcSalePrice / margin) * 1.1 * 100).toFixed(2) : "0.00";

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

        const confirmDelete = window.confirm("삭제하시겠습니까?");
        if (!confirmDelete) {
            return; // 사용자가 "아니오"를 선택하면 함수를 종료
        }

        // 로컬 상태에서 삭제
        setCalculatedOptions(prevOptions =>
            prevOptions.filter((_, index) => index !== indexToDelete)
        );
        setSelectedOptions(prevSelected =>
            prevSelected.filter(selectedIndex => selectedIndex !== indexToDelete)
        );

        try {
            // API 호출 이전에 id가 존재하는지 확인
            if (id) {
                await deleteExecutionAboutCampaign({ id }); // ID가 있을 때만 API 호출
            } else {
                console.log("삭제 실패");
            }
        } catch (error) {
            alert("삭제 실패"); // API 호출 실패 시 사용자에게 알림
        }
    };

    // 드래그 앤 드롭 핸들러
    const handleOnDragEnd = (result) => {
        if (!result.destination) return; // 드롭 위치가 없을 경우

        const items = Array.from(campaigns);
        const [reorderedItem] = items.splice(result.source.index, 1); // 원래 위치에서 아이템 제거
        items.splice(result.destination.index, 0, reorderedItem); // 새 위치에 아이템 추가

        // 캠페인 순서 업데이트
        onCampaignOrderChange(items); // 상위 컴포넌트에 변경된 캠페인 목록 전달
    };

    return (
        <div className="form-main-content">
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="campaigns">
                    {(provided) => (
                        <div
                            className="campaign-list"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {campaigns.map((campaign, index) => (
                                <Draggable key={campaign.campaignId} draggableId={String(campaign.campaignId)} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
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
                                                        handleDeleteOption={handleDeleteOption}
                                                        handleSelectAll={handleSelectAll}
                                                        allSelected={allSelected}
                                                    />
                                                    <ActionButtons
                                                        selectedOptions={selectedOptions}
                                                        options={calculatedOptions}
                                                        campaignId={campaign.campaignId}
                                                        handleCalculate={handleCalculate}
                                                        handleDeleteOption={handleDeleteOption}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default MarginCalculatorForm;
