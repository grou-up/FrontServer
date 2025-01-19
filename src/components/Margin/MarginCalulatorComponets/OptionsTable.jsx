import React from "react";
import "../../../styles/MarginCalculatorForm.css"; // CSS 연결
import ActionButtons from "./ActionButtons"; // ActionButtons 컴포넌트 import

function OptionsTable({
    options,
    selectedOptions,
    activeFields,
    handleRowChange,
    handleFieldSelection,
    handleCheckboxChange,
    calculateMargins, // 계산하기 함수
    saveOptions, // 저장하기 함수
}) {
    return (
        <div className="options-table-wrapper">
            <table className="options-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    handleCheckboxChange(
                                        e.target.checked
                                            ? options.map((option) => option.exeId)
                                            : []
                                    )
                                }
                                checked={
                                    selectedOptions.length === options.length &&
                                    selectedOptions.length > 0
                                }
                            />
                        </th>
                        <th>옵션 ID</th>
                        <th>상세 카테고리</th>
                        {["exeSalePrice", "exeTotalPrice", "exeCostPrice"].map((field) => (
                            <th key={field}>
                                {field === "exeSalePrice"
                                    ? "판매가"
                                    : field === "exeTotalPrice"
                                        ? "총 비용"
                                        : "원가"}
                                <input
                                    type="checkbox"
                                    checked={activeFields.includes(field)}
                                    onChange={() => handleFieldSelection(field)}
                                />
                            </th>
                        ))}
                        <th>마진</th>
                        <th>제로 ROAS</th>
                    </tr>
                </thead>
                <tbody>
                    {options.map((option, index) => (
                        <tr key={option.exeId}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedOptions.includes(option.exeId)}
                                    onChange={() => handleCheckboxChange(option.exeId)}
                                />
                            </td>
                            <td>{option.exeId}</td>
                            <td>{option.exeDetailCategory}</td>
                            {["exeSalePrice", "exeTotalPrice", "exeCostPrice"].map((field) => (
                                <td key={field}>
                                    <input
                                        type="number"
                                        value={option[field]}
                                        onChange={(e) =>
                                            handleRowChange(index, field, e.target.value)
                                        }
                                        disabled={
                                            activeFields.length > 0 &&
                                            !activeFields.includes(field) &&
                                            selectedOptions.length > 0
                                        }
                                    />
                                </td>
                            ))}
                            <td>{option.margin}</td>
                            <td>{option.zeroROAS}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ActionButtons 추가 */}
            <ActionButtons calculateMargins={calculateMargins} saveOptions={saveOptions} />
        </div>
    );
}

export default OptionsTable;
