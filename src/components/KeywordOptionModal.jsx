import React from 'react';
import '../styles/KeywordOptionModal.css'; // 스타일 파일

const KeywordOptionModal = ({ startDate, endDate, onClose, salesOptions, optionNames, children }) => {
    // optionNames가 배열인지 확인하고, 배열로 변환
    const optionNamesArray = Array.isArray(optionNames) ? optionNames : Object.values(optionNames);

    console.log("Sales Options:", salesOptions);
    console.log("Option Names Array:", optionNamesArray);
    // 옵션 ID와 이름 매칭
    const matchedOptions = Object.entries(salesOptions).map(([key, value]) => {
        const optionName = optionNamesArray.find(option => Number(option.exeId) === Number(key)); // ID를 숫자로 변환하여 비교
        return {
            id: key,
            name: optionName ? optionName.exeProductName : 'Unknown', // 이름이 없으면 'Unknown'
            quantity: value
        };
    });


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    &times; {/* 닫기 버튼 */}
                </button>
                {children}
                <div style={{ marginBottom: '10px' }}>
                    <h5 style={{ fontSize: '15px' }}>
                        조회 날짜: {startDate} ~ {endDate}
                    </h5>
                </div>
                <div>
                    {matchedOptions.length === 0 ? (
                        <p>판매 정보가 없습니다.</p> // 데이터가 없을 경우 메시지 표시
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>옵션 이름</th>
                                    <th>판매량</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matchedOptions.map(option => (
                                    <tr key={option.id}>
                                        <td>{option.name}</td>
                                        <td>{option.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KeywordOptionModal;
