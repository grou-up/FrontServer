// MarginResultModal.js
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // DatePicker 스타일
import "../../styles/margin/MarginResultModal.css"; // 스타일 파일

const MarginResultModal = ({ isOpen, onClose }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [tableData, setTableData] = useState([]); // 테이블 데이터를 저장할 상태

    if (!isOpen) return null;

    const fetchData = async () => {
        // 여기에 API 호출 로직을 추가합니다.
        // 예시: const response = await fetch(`your_api_endpoint?start=${startDate}&end=${endDate}`);
        // const data = await response.json();

        // Mock 데이터 (API 호출 결과)
        const mockData = [
            { id: 1, name: "옵션 1", margin: 100 },
            { id: 2, name: "옵션 2", margin: 150 },
            { id: 3, name: "옵션 3", margin: 200 },
        ];
        setTableData(mockData);
    };

    const handleSave = () => {
        fetchData(); // 저장 버튼 클릭 시 API 호출
        alert("저장되었습니다!");
    };

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
                    <button className="save-button" onClick={handleSave}>
                        수정하기
                    </button>
                </div>

                <div className="modal-body">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th><input type="checkbox" /></th>
                                <th>상품명</th>
                                <th>원가</th>
                                <th>총비용</th>
                                <th>마진</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map(item => (
                                <tr key={item.id}>
                                    <td><input type="checkbox" /></td>
                                    <td>{item.name}</td>
                                    <td>{item.margin}</td>
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

