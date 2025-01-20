import React, { useState, useEffect } from "react";
import OptionsTable from "./MarginCalulatorComponets/OptionsTable";
import { getMyCampaigns } from "../../services/campaign";
import { getMyExecutionData } from "../../services/execution";
import DatePicker from "react-datepicker";
import "../../styles/MarginCalculatorForm.css";

const MarginCalculatorForm = () => {
    const getYesterday = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday;
    };

    const [campaigns, setCampaigns] = useState([]); // 모든 캠페인
    const [expandedCampaignId, setExpandedCampaignId] = useState(null); // 확장된 캠페인 ID
    const [options, setOptions] = useState([]); // 옵션 데이터
    const [calculatedOptions, setCalculatedOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [activeFields, setActiveFields] = useState([]);
    const [startDate, setStartDate] = useState(getYesterday());
    const [endDate, setEndDate] = useState(getYesterday());

    // 캠페인 데이터 가져오기
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await getMyCampaigns();
                setCampaigns(response.data || []);
            } catch (error) {
                console.error("캠페인 데이터를 가져오는 중 오류 발생:", error);
            }
        };
        fetchCampaigns();
    }, []);

    const fetchOptionsForCampaign = async (campaignId) => {
        try {
            const response = await getMyExecutionData({ campaignId });
            const data = response.data.map((option) => ({
                ...option,
                margin: 0,
                zeroROAS: 0,
            }));
            setOptions(data);
            setCalculatedOptions(data);
        } catch (error) {
            console.error("옵션 데이터를 가져오는 중 오류 발생:", error);
        }
    };

    const handleRowChange = (index, field, value) => {
        const updatedOptions = [...calculatedOptions];
        const newValue = Number(value);

        if (selectedOptions.length > 0 && activeFields.length === 0) {
            updatedOptions.forEach((option) => {
                if (selectedOptions.includes(option.exeId)) {
                    Object.keys(option).forEach((key) => {
                        if (["exeSalePrice", "exeTotalPrice", "exeCostPrice"].includes(key)) {
                            option[key] = newValue;
                        }
                    });
                }
            });
        } else if (selectedOptions.length > 0 && activeFields.length > 0) {
            updatedOptions.forEach((option) => {
                if (selectedOptions.includes(option.exeId)) {
                    activeFields.forEach((activeField) => {
                        option[activeField] = newValue;
                    });
                }
            });
        } else if (activeFields.length > 0 && selectedOptions.length === 0) {
            updatedOptions.forEach((option) => {
                activeFields.forEach((activeField) => {
                    option[activeField] = newValue;
                });
            });
        } else {
            updatedOptions[index][field] = newValue;
        }

        setCalculatedOptions(updatedOptions);
    };

    const calculateMargins = () => {
        const updatedOptions = calculatedOptions.map((option) => {
            if (selectedOptions.includes(option.exeId)) {
                const margin =
                    option.exeSalePrice - 1.1 * option.exeTotalPrice - option.exeCostPrice || 0;
                const zeroROAS = (option.exeSalePrice / margin) * 1.1 * 100 || 0;
                return {
                    ...option,
                    margin: margin.toFixed(2),
                    zeroROAS: zeroROAS.toFixed(2),
                };
            }
            return option;
        });
        setCalculatedOptions(updatedOptions);
    };


    // 캠페인 카드 클릭 시 확장/축소
    const toggleExpandCampaign = (campaignId) => {
        if (expandedCampaignId === campaignId) {
            // 이미 확장된 캠페인 클릭 시 축소
            setExpandedCampaignId(null);
        } else {
            // 다른 캠페인 클릭 시 확장
            setExpandedCampaignId(campaignId);
            fetchOptionsForCampaign(campaignId);
        }
    };

    return (
        <div className="margin-calculator">
            {/* 날짜 선택 */}
            <div className="date-picker-container">
                <div className="date-range">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="yyyy-MM-dd"
                        maxDate={new Date()}
                        className="date-picker"
                    />
                    <span className="date-separator">~</span>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="yyyy-MM-dd"
                        minDate={startDate}
                        maxDate={new Date()}
                        className="date-picker"
                    />
                </div>
            </div>

            {/* 캠페인 리스트 */}
            <div className="campaign-list">
                {campaigns.map((campaign) => (
                    <div
                        key={campaign.campaignId}
                        className={`campaign-card ${expandedCampaignId === campaign.campaignId ? "expanded" : ""}`}
                    >
                        {/* 캠페인 제목과 설명 */}
                        <div
                            className="campaign-header"
                            onClick={() => toggleExpandCampaign(campaign.campaignId)}
                        >
                            <h3>{campaign.title}</h3>
                            <div
                                className="campaign-inputs"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <input
                                    type="number"
                                    placeholder="판매가"
                                    onChange={(e) => {
                                        const updatedOptions = options.map((option) => ({
                                            ...option,
                                            exeSalePrice: Number(e.target.value),
                                        }));
                                        setOptions(updatedOptions);
                                        setCalculatedOptions(updatedOptions);
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="총비용"
                                    onChange={(e) => {
                                        const updatedOptions = options.map((option) => ({
                                            ...option,
                                            exeTotalPrice: Number(e.target.value),
                                        }));
                                        setOptions(updatedOptions);
                                        setCalculatedOptions(updatedOptions);
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="원가"
                                    onChange={(e) => {
                                        const updatedOptions = options.map((option) => ({
                                            ...option,
                                            exeCostPrice: Number(e.target.value),
                                        }));
                                        setOptions(updatedOptions);
                                        setCalculatedOptions(updatedOptions);
                                    }}
                                />
                            </div>
                        </div>

                        {/* 확장된 캠페인의 데이터 */}
                        {expandedCampaignId === campaign.campaignId && (
                            <div className="campaign-details">
                                <OptionsTable
                                    options={calculatedOptions}
                                    selectedOptions={selectedOptions}
                                    activeFields={activeFields}
                                    handleRowChange={handleRowChange}
                                    handleCheckboxChange={(exeId) =>
                                        setSelectedOptions((prev) =>
                                            prev.includes(exeId)
                                                ? prev.filter((id) => id !== exeId)
                                                : [...prev, exeId]
                                        )
                                    }
                                    handleFieldSelection={(field) =>
                                        setActiveFields((prev) =>
                                            prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
                                        )
                                    }
                                    calculateMargins={calculateMargins}
                                    saveOptions={() => alert("저장 기능은 아직 구현되지 않았습니다.")}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarginCalculatorForm;
