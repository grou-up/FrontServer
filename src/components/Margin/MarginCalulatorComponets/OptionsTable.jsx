import React from "react";
import "../../../styles/MarginCalculatorForm.css"; // CSS 연결

function OptionsTable({
    options,
    handleInputChange,
    handleCheckboxChange,
    selectedOptions,
    handleDeleteOption, // 삭제 핸들러 추가
    handleSelectAll, // 전체 선택 핸들러 추가
    allSelected // 전체 선택 상태
}) {
    const calculateShippingCost = (salePrice) => {
        if (salePrice == "") return 0;
        if (salePrice < 0) return 0;
        if (salePrice >= 0 && salePrice < 5000) return 300;
        if (salePrice >= 5000 && salePrice < 10000) return 400;
        if (salePrice >= 10000 && salePrice < 15000) return 600;
        if (salePrice >= 15000 && salePrice < 20000) return 800;
        return 1000;
    };
    return (
        <div className="options-table-wrapper">
            <table className="options-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={allSelected} // 전체 선택 상태에 따라 체크박스 상태 결정
                                onChange={handleSelectAll} // 전체 선택 핸들러 호출
                            />
                        </th>
                        <th>옵션명</th>
                        <th>판매가</th>
                        <th>판매 유형</th>
                        <th>총 비용</th>
                        <th>원가</th>
                        <th>반품비</th>
                        <th>입고비</th>
                        <th>마진</th>
                        <th>제로 ROAS</th>
                        <th>삭제</th> {/* 삭제 열 추가 */}
                    </tr>
                </thead>
                <tbody>
                    {options.map((option, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedOptions.includes(index)}
                                    onChange={() => handleCheckboxChange(index)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={option.mfcProductName || ""}
                                    onChange={(e) => handleInputChange(index, 'mfcProductName', e.target.value)}
                                    className="option-input-name"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={option.mfcSalePrice || ""}
                                    onChange={(e) => handleInputChange(index, 'mfcSalePrice', e.target.value)}
                                    className="option-input"
                                />
                            </td>

                            <td>
                                <select
                                    className="margin-dropdown"
                                    value={option.mfcType || ""}
                                    onChange={(e) => handleInputChange(index, 'mfcType', e.target.value)}
                                >
                                    <option value="">선택</option>
                                    <option value="ROCKET_GROWTH">로켓그로스</option>
                                    <option value="SELLER_DELIVERY">판매자배송</option>
                                </select>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={option.mfcTotalPrice || ""}
                                    onChange={(e) => handleInputChange(index, 'mfcTotalPrice', e.target.value)}
                                    className="option-input"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={option.mfcCostPrice || ""}
                                    onChange={(e) => handleInputChange(index, 'mfcCostPrice', e.target.value)}
                                    className="option-input"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={option.mfcReturnPrice || ""}
                                    onChange={(e) => handleInputChange(index, 'mfcReturnPrice', e.target.value)}
                                    className="option-input"
                                />
                            </td>
                            <td>
                                <span className="option-text">
                                    {calculateShippingCost(option.mfcSalePrice || 0)} {/* 판매가에 따라 입고비 표시 */}
                                </span>
                            </td>
                            <td>
                                <span className="option-text">
                                    {option.mfcPerPiece !== "" ? option.mfcPerPiece : ""}
                                </span>
                            </td>
                            <td>
                                <span className="option-text">
                                    {option.mfcZeroRoas !== "" ? option.mfcZeroRoas.toFixed(2) : ""}
                                </span>
                            </td>
                            <td>
                                <button
                                    onClick={() => handleDeleteOption(index)} // 삭제 핸들러 호출
                                    className="delete-button"
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OptionsTable;
