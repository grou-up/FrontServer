import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // DatePicker 스타일
import "../../styles/margin/MarginResultModal.css"; // 스타일 파일
import { getExecutionAboutCampaign } from "../../services/marginforcampaign";
import { marginUpdatesByPeriod } from "../../services/margin";
const MarginResultModal = ({ isOpen, onClose, campaignId }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [tableData, setTableData] = useState([]); // 테이블 데이터를 저장할 상태
    const [selectedOptions, setSelectedOptions] = useState([]); // 선택된 옵션 상태
    const [allSelected, setAllSelected] = useState(false); // 전체 선택 상태

    useEffect(() => {
        if (isOpen) {
            fetchData(campaignId); // 모달이 열릴 때 데이터 가져오기
        }
    }, [isOpen, campaignId]); // isOpen과 campaignId가 변경될 때마다 실행

    const fetchData = async (campaignId) => {
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
            setTableData(optionsWithDefaults);
        } catch (error) {
            console.error("옵션 데이터를 가져오는 중 오류 발생:", error);
        }
    };
    const handleCalculate = () => {
        const updatedOptions = [...tableData];

        selectedOptions.forEach(index => {
            if (index < 0 || index >= updatedOptions.length) {
                console.warn(`Invalid index: ${index}`);
                return; // 유효하지 않은 인덱스는 무시
            }

            const option = updatedOptions[index];

            // 필요한 값이 존재하는지 확인
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

        setTableData(updatedOptions); // 업데이트된 데이터를 상태에 설정
    };

    const handleSave = async () => {

        if (selectedOptions.length === 0) {
            alert("옵션을 선택해주세요.");
            return;
        }
        const updatedOptions = [...tableData]; // 원본 옵션 복사

        selectedOptions.forEach(index => {
            const option = updatedOptions[index];
            if (option.mfcSalePrice && option.mfcTotalPrice && option.mfcCostPrice) {
                const margin = Math.round(option.mfcSalePrice - (1.1 * option.mfcTotalPrice) - option.mfcCostPrice) || 0;
                const zeroROAS = margin !== 0 ? ((option.mfcSalePrice / margin) * 1.1 * 100).toFixed(2) : "0.00";

                // 마진과 제로 ROAS 업데이트
                option.mfcPerPiece = margin;
                option.mfcZeroRoas = parseFloat(zeroROAS);
            }
        });
        const mfcRequestWithDatesDto = {
            campaignId: campaignId,
            startDate: startDate.toISOString().split("T")[0], // 선택된 시작 날짜
            endDate: endDate.toISOString().split("T")[0], // 선택된 종료 날짜
            data: selectedOptions.map(index => ({
                mfcProductName: updatedOptions[index].mfcProductName,
                mfcSalePrice: updatedOptions[index].mfcSalePrice,
                mfcTotalPrice: updatedOptions[index].mfcTotalPrice,
                mfcCostPrice: updatedOptions[index].mfcCostPrice,
                mfcPerPiece: updatedOptions[index].mfcPerPiece,
                mfcZeroRoas: updatedOptions[index].mfcZeroRoas,
            })),
        };

        try {
            await marginUpdatesByPeriod(mfcRequestWithDatesDto);
            alert("선택된 데이터가 저장되었습니다!");
        } catch (error) {
            console.error("저장 중 오류 발생:", error);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    const handleCheckboxChange = (index) => {
        setSelectedOptions((prev) => {
            if (prev.includes(index)) {
                return prev.filter((i) => i !== index); // 체크 해제
            } else {
                return [...prev, index]; // 체크
            }
        });
    };

    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedOptions([]); // 전체 선택 해제
        } else {
            setSelectedOptions(tableData.map((_, index) => index)); // 전체 선택
        }
        setAllSelected(!allSelected); // 전체 선택 상태 반전
    };

    // 모달이 열리지 않을 때는 null을 반환
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>

                <div className="modal-header">
                    <h2>옵션 마진 설정</h2>
                </div>

                <div className="date-picker-container">
                    <div className="date-picker-group">
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
                    <div className="action-buttons">
                        <button className="calculate" onClick={handleCalculate}>
                            계산하기
                        </button>
                        <button className="save" onClick={handleSave}>
                            수정하기
                        </button>
                    </div>

                </div>

                <div className="modal-body">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th>옵션명</th>
                                <th>판매가</th>
                                <th>총비용</th>
                                <th>원가</th>
                                <th>마진</th>
                                <th>제로ROAS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((item, index) => (
                                <tr key={item.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedOptions.includes(index)}
                                            onChange={() => handleCheckboxChange(index)}
                                        />
                                    </td>
                                    <td>{item.mfcProductName}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.mfcSalePrice}
                                            onChange={(e) => {
                                                const updatedTableData = [...tableData];
                                                updatedTableData[index].mfcSalePrice = parseFloat(e.target.value) || 0;
                                                setTableData(updatedTableData);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.mfcTotalPrice}
                                            onChange={(e) => {
                                                const updatedTableData = [...tableData];
                                                updatedTableData[index].mfcTotalPrice = parseFloat(e.target.value) || 0;
                                                setTableData(updatedTableData);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.mfcCostPrice}
                                            onChange={(e) => {
                                                const updatedTableData = [...tableData];
                                                updatedTableData[index].mfcCostPrice = parseFloat(e.target.value) || 0;
                                                setTableData(updatedTableData);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <span className="option-text">
                                            {(item.mfcPerPiece)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="option-text">
                                            {item.mfcZeroRoas.toFixed(2)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MarginResultModal;
