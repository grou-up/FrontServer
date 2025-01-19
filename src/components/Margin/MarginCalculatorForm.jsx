import React, { useState, useEffect } from "react";
import axios from "axios";
import { getMyCampaigns } from "../../services/campaign";

function MarginCalculatorForm() {
    const [campaigns, setCampaigns] = useState([]); // 캠페인 목록
    const [selectedCampaignId, setSelectedCampaignId] = useState(null); // 선택된 캠페인 ID
    const [options, setOptions] = useState([]); // 선택된 캠페인의 옵션 데이터

    const [updatedOptions, setUpdatedOptions] = useState({}); // 수정된 옵션 데이터

    // 캠페인 목록 가져오기
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await getMyCampaigns();
                setCampaigns(response.data || []);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            }
        };
        fetchCampaigns();
    }, []);

    // 선택한 캠페인의 옵션 데이터를 백엔드에서 가져오기
    const fetchOptionsForCampaign = async (campaignId) => {
        try {
            const response = await axios.get(`/api/campaigns/${campaignId}/options`);
            setOptions(response.data); // 옵션 데이터 설정
            setUpdatedOptions(response.data.reduce((acc, option) => {
                acc[option.id] = { ...option }; // 수정 가능한 형태로 변환
                return acc;
            }, {}));
        } catch (error) {
            console.error("옵션 데이터를 가져오는 중 오류 발생:", error);
        }
    };

    // 캠페인 선택 시 호출
    const handleCampaignSelect = (e) => {
        const campaignId = e.target.value;
        console.log(campaignId)
        setSelectedCampaignId(campaignId);
        fetchOptionsForCampaign(campaignId); // 선택한 캠페인 옵션 가져오기
    };

    // 테이블 셀 값 변경
    const handleOptionChange = (optionId, fieldName, value) => {
        setUpdatedOptions((prevState) => ({
            ...prevState,
            [optionId]: {
                ...prevState[optionId],
                [fieldName]: value,
            },
        }));
    };

    // 수정된 데이터를 저장 (백엔드에 전송)
    const saveOptions = async () => {
        try {
            await axios.put(`/api/campaigns/${selectedCampaignId}/options`, Object.values(updatedOptions));
            alert("옵션 데이터가 성공적으로 저장되었습니다.");
        } catch (error) {
            console.error("옵션 데이터를 저장하는 중 오류 발생:", error);
            alert("옵션 데이터를 저장하는 중 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <h2>마진 계산기</h2>

            {/* 캠페인 선택 */}
            <div>
                <label>캠페인 선택:</label>
                <select onChange={handleCampaignSelect} value={selectedCampaignId || ""}>
                    <option value="" disabled>
                        캠페인을 선택하세요
                    </option>
                    {campaigns.map((campaign) => (
                        <option key={campaign.campaignId} value={campaign.campaignId}>
                            {campaign.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* 옵션 테이블 */}
            {options.length > 0 && (
                <div>
                    <h3>옵션 데이터</h3>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>옵션 ID</th>
                                <th>옵션 이름</th>
                                <th>옵션 값</th>
                                <th>수정 가능 값</th>
                            </tr>
                        </thead>
                        <tbody>
                            {options.map((option) => (
                                <tr key={option.id}>
                                    <td>{option.id}</td>
                                    <td>{option.name}</td>
                                    <td>{option.value}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={updatedOptions[option.id]?.value || ""}
                                            onChange={(e) =>
                                                handleOptionChange(option.id, "value", e.target.value)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={saveOptions}>저장</button>
                </div>
            )}
        </div>
    );
}

export default MarginCalculatorForm;
